import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

import type { Transaction } from '@tiptap/pm/state'
import type { EditorView } from '@tiptap/pm/view'

type Placeholder = { id: object; pos: number }

/**
 * generation は文書の世代。全消去・差し替えのたびに増える。
 * アップロード開始時と完了時で値が違えば、挿入先の文書はもう存在しない。
 */
type PlaceholderState = {
  placeholders: readonly Placeholder[]
  decorations: DecorationSet
  generation: number
}

export const imageUploadPlaceholderKey = new PluginKey<PlaceholderState>('imageUploadPlaceholder')

type AddAction = { add: { id: object; pos: number } }
type RemoveAction = { remove: { id: object } }
type ResetAction = { reset: true }
type PlaceholderMeta = AddAction | RemoveAction | ResetAction

const PLACEHOLDER_CLASS = 'smarthr-ui-RichTextEditor-imageUploadPlaceholder'

const createPlaceholderElement = (): HTMLElement => {
  const el = document.createElement('span')
  el.className = PLACEHOLDER_CLASS
  // アップロード中スピナー。読み上げ向けに status ロールを付与する。
  el.setAttribute('role', 'status')
  return el
}

export const imageUploadPlaceholderPlugin = (): Plugin<PlaceholderState> =>
  new Plugin<PlaceholderState>({
    key: imageUploadPlaceholderKey,
    state: {
      init: () => ({ placeholders: [], decorations: DecorationSet.empty, generation: 0 }),
      apply(tr, state) {
        const meta = tr.getMeta(imageUploadPlaceholderKey) as PlaceholderMeta | undefined

        if (meta && 'reset' in meta) {
          return {
            placeholders: [],
            decorations: DecorationSet.empty,
            generation: state.generation + 1,
          }
        }

        if (!meta && (!tr.docChanged || state.placeholders.length === 0)) return state

        // DecorationSet.map は位置の片側が置き換わっただけでも widget を捨てる。段落の末尾へ
        // 画像を挿入すると閉じタグごと置き換わるため、同じ位置で待つ別のアップロードが消えていた
        let placeholders = state.placeholders.flatMap(({ id, pos }) => {
          const mapped = tr.mapping.mapResult(pos, 1)

          return mapped.deletedAcross ? [] : [{ id, pos: mapped.pos }]
        })

        if (
          !meta &&
          placeholders.length === state.placeholders.length &&
          placeholders.every(({ pos }, i) => pos === state.placeholders[i].pos)
        ) {
          return state
        }

        if (meta && 'add' in meta) {
          placeholders = [...placeholders, meta.add]
        } else if (meta && 'remove' in meta) {
          placeholders = placeholders.filter(({ id }) => id !== meta.remove.id)
        }

        const decorations = DecorationSet.create(
          tr.doc,
          placeholders.map(({ id, pos }) =>
            Decoration.widget(pos, createPlaceholderElement, { id }),
          ),
        )

        return { placeholders, decorations, generation: state.generation }
      },
    },
    props: {
      decorations(state) {
        return imageUploadPlaceholderKey.getState(state)?.decorations ?? null
      },
    },
  })

/** 現在の文書世代。プラグイン未登録なら 0。 */
export const getImagePlaceholderGeneration = (view: EditorView): number =>
  imageUploadPlaceholderKey.getState(view.state)?.generation ?? 0

/** プレースホルダを pos に追加。識別用の id と、その時点の文書世代を返す。 */
export const addImagePlaceholder = (
  view: EditorView,
  pos: number,
): { id: object; generation: number } => {
  const id = {}
  view.dispatch(view.state.tr.setMeta(imageUploadPlaceholderKey, { add: { id, pos } }))

  return { id, generation: getImagePlaceholderGeneration(view) }
}

/** id のプレースホルダを除去する。 */
export const removeImagePlaceholder = (view: EditorView, id: object): void => {
  view.dispatch(view.state.tr.setMeta(imageUploadPlaceholderKey, { remove: { id } }))
}

/**
 * 未完了のアップロードをすべて無効化する。
 * 文書を差し替える transaction 自体に載せることで、間に画像挿入が割り込む余地をなくす。
 */
export const resetImagePlaceholders = (tr: Transaction): Transaction =>
  tr.setMeta(imageUploadPlaceholderKey, { reset: true })

/** id のプレースホルダの現在位置を返す。見つからなければ null。 */
export const findImagePlaceholderPos = (view: EditorView, id: object): number | null => {
  const found = imageUploadPlaceholderKey
    .getState(view.state)
    ?.placeholders.find((placeholder) => placeholder.id === id)

  return found ? found.pos : null
}
