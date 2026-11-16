import { type Editor, Extension } from '@tiptap/core'
import { closeHistory } from '@tiptap/pm/history'
import { NodeSelection, Plugin, PluginKey, Selection, TextSelection } from '@tiptap/pm/state'

import { isApplePlatform } from '../../hooks/useIsApplePlatform'
import { type BlockCatalogId, describeBlock } from '../blockCatalog'

import {
  type BlockRange,
  type MoveTarget,
  blockRangeAt,
  findBoundaryIndex,
  isCurrentRange,
  isEmptyParagraph,
  planMove,
  resolveBlockRange,
} from './blockRange'
import { getBlockShortcuts } from './blockShortcuts'

import type { RichTextFeature } from '../../types'
import type { AnchorRect } from '../floatingGeometry'
import type { Fragment, Node as PMNode } from '@tiptap/pm/model'
import type { Transaction } from '@tiptap/pm/state'
import type { EditorView } from '@tiptap/pm/view'

declare module '@tiptap/core' {
  // declaration merging が必要なため interface を使用
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Commands<ReturnType> {
    blockActions: {
      /** range を省くと、選択がまたぐ最上位のブロックを動かす */
      moveBlocks: (options: { range?: BlockRange; to: MoveTarget }) => ReturnType
      duplicateBlocks: (options?: { range?: BlockRange }) => ReturnType
      deleteBlocks: (options?: { range?: BlockRange }) => ReturnType
      /** pos を含む最上位のブロックのすぐ下に空の段落を足す。スラッシュコマンドのメニューが描かれていれば / も入れて開く */
      addBlockBelow: (pos: number) => ReturnType
    }
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Storage {
    blockActions?: BlockActionsStorage
  }
}

export type BlockMenuOptions = {
  /** 省くとキャレットの位置に開く */
  getAnchorRect?: () => AnchorRect
  /** Esc・項目の実行・外のクリック・文書の変更など、閉じ方を問わず閉じたときに呼ぶ */
  onClose?: () => void
}

type BlockActionsStorage = {
  openMenu: ((range: BlockRange, options?: BlockMenuOptions) => void) | null
  /** dragover では dataTransfer の値を読めない（types だけ読める）ため、掴んだ範囲はここに持つ */
  dragSource: BlockRange | null
  /** null は、落としても動かない位置か、ドラッグが本文を出たか落としたとき */
  handleDropTargetChange: ((boundary: number | null) => void) | null
}

type BlockActionsOptions = {
  getFeatures: () => readonly RichTextFeature[]
}

// restrict はコマンドを剥がさず、Tiptap のコマンドは editable も見ないので、ここで止める
const isActive = (editor: Editor, options: BlockActionsOptions) =>
  editor.isEditable && options.getFeatures().includes('blockActions')

export const BLOCK_ANNOUNCEMENT_META = 'blockAnnouncement'

export const BLOCK_DRAG_TYPE = 'application/x-smarthr-rte-block'

const BLOCK_DROP_PLUGIN_KEY = new PluginKey('blockActionsDrop')

export const getBlockRects = (view: EditorView) => {
  const rects: DOMRect[] = []

  view.state.doc.forEach((_node, offset) => {
    const dom = view.nodeDOM(offset)

    rects.push(dom instanceof HTMLElement ? dom.getBoundingClientRect() : new DOMRect())
  })

  return rects
}

type BlockSubject = { blockId: BlockCatalogId | null; excerpt: string; count: number }

export type BlockAnnouncement =
  | ({ type: 'moved'; position: number } & BlockSubject)
  | ({ type: 'duplicated' | 'deleted' } & BlockSubject)
  | { type: 'moveLimit'; edge: 'first' | 'last' }

const subjectOf = (content: Fragment): BlockSubject => ({
  ...describeBlock(content.firstChild!),
  count: content.childCount,
})

/** 文字のブロックやリスト・表をノード選択のままにすると、ツールバーのほぼ全体と Mod-K が効かなくなる */
const toEditableSelection = (selection: Selection) =>
  selection instanceof NodeSelection && !selection.node.isAtom
    ? Selection.near(selection.$from.doc.resolve(selection.from + 1))
    : selection

// ギャップカーソルは隣のブロックが変わると置けない位置になりうるので、ずらさずに先頭へ置き直す
const SHIFTABLE_SELECTIONS = ['text', 'node', 'cell']

const selectionAt = (doc: PMNode, before: Selection, range: BlockRange, newFrom: number) => {
  // 次のブロックの先頭で終わる選択は、そのブロックを範囲に含めない。外に出た端は範囲の終わりに寄せて選択を保ち、
  // 続けて動かしたときに 1 つだけ動くのを防ぐ
  if (
    before instanceof TextSelection &&
    before.from >= range.from &&
    before.from < range.to &&
    before.to > range.to
  ) {
    const shift = (pos: number) => Math.min(pos, range.to) + newFrom - range.from

    return TextSelection.between(doc.resolve(shift(before.anchor)), doc.resolve(shift(before.head)))
  }

  const json = before.toJSON()

  if (
    before.from >= range.from &&
    before.to <= range.to &&
    SHIFTABLE_SELECTIONS.includes(json.type)
  ) {
    const delta = newFrom - range.from

    return toEditableSelection(
      Selection.fromJSON(doc, {
        ...json,
        ...(typeof json.head === 'number' ? { head: json.head + delta } : {}),
        anchor: json.anchor + delta,
      }),
    )
  }

  return toEditableSelection(Selection.near(doc.resolve(newFrom)))
}

const announce = (tr: Transaction, announcement: BlockAnnouncement) =>
  tr.setMeta(BLOCK_ANNOUNCEMENT_META, announcement)

export const BlockActions = Extension.create<BlockActionsOptions, BlockActionsStorage>({
  name: 'blockActions',

  addOptions() {
    return {
      getFeatures: () => [],
    }
  },

  addStorage() {
    return {
      openMenu: null,
      dragSource: null,
      handleDropTargetChange: null,
    }
  },

  addCommands() {
    const targetOf = (tr: Transaction, range?: BlockRange) => {
      if (!isActive(this.editor, this.options)) return null
      if (!range) return resolveBlockRange(tr.doc, tr.selection)

      return isCurrentRange(tr.doc, range) ? range : null
    }

    return {
      moveBlocks:
        ({ range, to }) =>
        ({ tr, dispatch }) => {
          const target = targetOf(tr, range)
          const plan = target ? planMove(tr.doc, target, to) : null

          if (!target || plan?.type !== 'move') return false

          if (dispatch) {
            const content = tr.doc.slice(target.from, target.to).content
            const before = tr.selection

            closeHistory(tr).delete(target.from, target.to).insert(plan.insertAt, content)
            tr.setSelection(selectionAt(tr.doc, before, target, plan.insertAt))
            announce(tr, {
              ...subjectOf(content),
              type: 'moved',
              position: plan.startIndex + 1,
            }).scrollIntoView()
          }

          return true
        },
      duplicateBlocks:
        ({ range } = {}) =>
        ({ tr, dispatch }) => {
          const target = targetOf(tr, range)

          if (!target) return false

          if (dispatch) {
            const content = tr.doc.slice(target.from, target.to).content
            const before = tr.selection

            closeHistory(tr).insert(target.to, content)
            tr.setSelection(selectionAt(tr.doc, before, target, target.to))
            announce(tr, { ...subjectOf(content), type: 'duplicated' }).scrollIntoView()
          }

          return true
        },
      deleteBlocks:
        ({ range } = {}) =>
        ({ tr, dispatch }) => {
          const target = targetOf(tr, range)

          if (!target || (tr.doc.childCount === 1 && isEmptyParagraph(tr.doc.firstChild))) {
            return false
          }

          if (dispatch) {
            const content = tr.doc.slice(target.from, target.to).content
            const before = tr.selection

            closeHistory(tr)

            if (target.startIndex === 0 && target.endIndex === tr.doc.childCount) {
              tr.replaceWith(0, tr.doc.content.size, tr.doc.type.schema.nodes.paragraph.create())
            } else {
              tr.delete(target.from, target.to)
            }

            // 選択の外を消したときは、Transaction が写した元の位置のままにし、そこへスクロールもしない。
            // ⋮⋮ のメニューで離れたブロックを消すと、見ていた位置からキャレットまで飛ぶ
            if (before.from <= target.to && before.to >= target.from) {
              const $pos = tr.doc.resolve(Math.min(target.from, tr.doc.content.size))

              tr.setSelection(
                toEditableSelection(Selection.near($pos, $pos.pos < tr.doc.content.size ? 1 : -1)),
              ).scrollIntoView()
            }

            announce(tr, { ...subjectOf(content), type: 'deleted' })
          }

          return true
        },
      addBlockBelow:
        (pos) =>
        ({ tr, dispatch, editor }) => {
          if (
            !isActive(this.editor, this.options) ||
            !Number.isInteger(pos) ||
            pos < 0 ||
            pos > tr.doc.content.size
          ) {
            return false
          }

          if (dispatch) {
            const index = Math.min(tr.doc.resolve(pos).index(0), tr.doc.childCount - 1)
            const { to } = blockRangeAt(tr.doc, index)

            closeHistory(tr).insert(to, tr.doc.type.schema.nodes.paragraph.create())
            tr.setSelection(TextSelection.create(tr.doc, to + 1))

            // メニューが描かれていない（hideToolbar など）ときに入れると、開かない / だけが残る
            if (
              this.options.getFeatures().includes('slashCommand') &&
              editor.storage.slashCommand?.handleKeyDown
            ) {
              tr.insertText('/')
            }

            tr.scrollIntoView()
          }

          return true
        },
    }
  },

  onTransaction({ transaction }) {
    // closeHistory は付けたトランザクションの前でしか取り消しの単位を区切らず、続けて打った文字が操作と一緒に取り消される。
    // appendTransaction で区切らないのは、末尾に空の段落を足すプラグインより先に走り、その段落だけが別の単位になるため。
    // dispatch の途中で dispatch すると入れ子になるので、次のマイクロタスクで区切る
    if (transaction.docChanged && transaction.getMeta(BLOCK_ANNOUNCEMENT_META)) {
      queueMicrotask(() => {
        if (!this.editor.isDestroyed) this.editor.view.dispatch(closeHistory(this.editor.state.tr))
      })
    }
  },

  addProseMirrorPlugins() {
    const { editor } = this
    const sourceOf = (event: DragEvent) => {
      const source = editor.storage.blockActions?.dragSource

      return source && event.dataTransfer?.types.includes(BLOCK_DRAG_TYPE) ? source : null
    }
    const boundaryOf = (view: EditorView, event: DragEvent) =>
      findBoundaryIndex(getBlockRects(view), event.clientY)

    return [
      new Plugin({
        key: BLOCK_DROP_PLUGIN_KEY,
        props: {
          // view.dragging を立てて ProseMirror 標準の drop に任せると、貼り付けと同じく features に無い書式が落ち、
          // リストや表の中にも入る
          handleDOMEvents: {
            dragover: (view, event) => {
              const source = sourceOf(event)

              if (!source) return false

              event.preventDefault()

              const plan = planMove(view.state.doc, source, boundaryOf(view, event))

              editor.storage.blockActions?.handleDropTargetChange?.(
                plan.type === 'move' ? plan.boundary : null,
              )

              return true
            },
            dragleave: (view, event) => {
              // relatedTarget は見ない。Safari のドラッグでは入らず、本文の中で要素をまたぐたびに線が消える
              const { left, right, top, bottom } = view.dom.getBoundingClientRect()
              const { clientX: x, clientY: y } = event
              const isInside = x >= left && x < right && y >= top && y < bottom

              if (sourceOf(event) && !isInside) {
                editor.storage.blockActions?.handleDropTargetChange?.(null)
              }

              return false
            },
            drop: (view, event) => {
              const source = sourceOf(event)

              if (!source) return false

              event.preventDefault()
              // ⋮⋮ を掴んだときに本文のフォーカスが外れている。戻さないと続けて取り消しやキーで動かせない
              view.focus()
              editor.commands.moveBlocks({ range: source, to: boundaryOf(view, event) })
              // dragSource は ⋮⋮ の dragend で外す。ここで外すと dragend より先に測り直しが走り、
              // 掴んでいる ⋮⋮ を隠して dragend が届かなくなりうる
              editor.storage.blockActions?.handleDropTargetChange?.(null)

              return true
            },
          },
        },
      }),
    ]
  },

  addKeyboardShortcuts() {
    const { editor, options } = this
    const shortcuts = getBlockShortcuts(isApplePlatform())

    // 端でもキーを奪うのは、端でだけキーが素通りしてブラウザ既定の別の操作が起きないようにするため
    const move = (to: 'up' | 'down') => () => {
      if (!isActive(editor, options)) return false

      const { state, view } = editor
      const plan = planMove(state.doc, resolveBlockRange(state.doc, state.selection), to)

      if (plan.type === 'limit') {
        view.dispatch(announce(state.tr, { type: 'moveLimit', edge: plan.edge }))

        return true
      }

      return editor.commands.moveBlocks({ to })
    }

    // メニューが描かれていない（hideToolbar など）ときはキーを奪わず、ブラウザ既定の動作に任せる
    const openMenu = () => {
      const open = editor.storage.blockActions?.openMenu

      if (!open || !isActive(editor, options)) return false

      open(resolveBlockRange(editor.state.doc, editor.state.selection))

      return true
    }

    return {
      [shortcuts.moveUp]: move('up'),
      [shortcuts.moveDown]: move('down'),
      [shortcuts.menu]: openMenu,
    }
  },
})
