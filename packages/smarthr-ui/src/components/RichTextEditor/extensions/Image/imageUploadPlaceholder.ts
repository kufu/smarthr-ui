import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

import type { EditorView } from '@tiptap/pm/view'

export const imageUploadPlaceholderKey = new PluginKey<DecorationSet>('imageUploadPlaceholder')

type AddAction = { add: { id: object; pos: number } }
type RemoveAction = { remove: { id: object } }
type PlaceholderMeta = AddAction | RemoveAction

const PLACEHOLDER_CLASS = 'smarthr-ui-RichTextEditor-imageUploadPlaceholder'

const createPlaceholderElement = (): HTMLElement => {
  const el = document.createElement('span')
  el.className = PLACEHOLDER_CLASS
  // アップロード中スピナー。読み上げ向けに status ロールを付与する。
  el.setAttribute('role', 'status')
  return el
}

export const imageUploadPlaceholderPlugin = (): Plugin<DecorationSet> =>
  new Plugin<DecorationSet>({
    key: imageUploadPlaceholderKey,
    state: {
      init: () => DecorationSet.empty,
      apply(tr, set) {
        let next = set.map(tr.mapping, tr.doc)
        const meta = tr.getMeta(imageUploadPlaceholderKey) as PlaceholderMeta | undefined
        if (meta && 'add' in meta) {
          const widget = Decoration.widget(meta.add.pos, createPlaceholderElement, {
            id: meta.add.id,
          })
          next = next.add(tr.doc, [widget])
        } else if (meta && 'remove' in meta) {
          next = next.remove(next.find(undefined, undefined, (spec) => spec.id === meta.remove.id))
        }
        return next
      },
    },
    props: {
      decorations(state) {
        return imageUploadPlaceholderKey.getState(state) ?? null
      },
    },
  })

/** プレースホルダを pos に追加。識別用の id（オブジェクト）を返す。 */
export const addImagePlaceholder = (view: EditorView, pos: number): object => {
  const id = {}
  const tr = view.state.tr.setMeta(imageUploadPlaceholderKey, { add: { id, pos } })
  view.dispatch(tr)
  return id
}

/** id のプレースホルダを除去する。 */
export const removeImagePlaceholder = (view: EditorView, id: object): void => {
  const tr = view.state.tr.setMeta(imageUploadPlaceholderKey, { remove: { id } })
  view.dispatch(tr)
}

/** id のプレースホルダの現在位置を返す。見つからなければ null。 */
export const findImagePlaceholderPos = (view: EditorView, id: object): number | null => {
  const set = imageUploadPlaceholderKey.getState(view.state)
  if (!set) return null
  const found = set.find(undefined, undefined, (spec) => spec.id === id)
  return found.length > 0 ? found[0].from : null
}
