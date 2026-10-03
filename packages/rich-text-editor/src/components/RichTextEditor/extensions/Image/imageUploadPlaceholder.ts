import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

import type { Transaction } from '@tiptap/pm/state'
import type { EditorView } from '@tiptap/pm/view'

/**
 * generation は文書の世代。全消去・差し替えのたびに増える。
 * アップロード開始時と完了時で値が違えば、挿入先の文書はもう存在しない。
 */
type PlaceholderState = { decorations: DecorationSet; generation: number }

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
      init: () => ({ decorations: DecorationSet.empty, generation: 0 }),
      apply(tr, state) {
        const meta = tr.getMeta(imageUploadPlaceholderKey) as PlaceholderMeta | undefined

        if (meta && 'reset' in meta) {
          return { decorations: DecorationSet.empty, generation: state.generation + 1 }
        }

        let decorations = state.decorations.map(tr.mapping, tr.doc)

        if (meta && 'add' in meta) {
          const widget = Decoration.widget(meta.add.pos, createPlaceholderElement, {
            id: meta.add.id,
          })
          decorations = decorations.add(tr.doc, [widget])
        } else if (meta && 'remove' in meta) {
          decorations = decorations.remove(
            decorations.find(undefined, undefined, (spec) => spec.id === meta.remove.id),
          )
        }

        return { decorations, generation: state.generation }
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
  const state = imageUploadPlaceholderKey.getState(view.state)

  if (!state) return null

  const found = state.decorations.find(undefined, undefined, (spec) => spec.id === id)

  return found.length > 0 ? found[0].from : null
}
