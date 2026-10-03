'use client'

import { useEditorState } from '@tiptap/react'
import { type FC, type RefObject, memo, useCallback, useEffect, useState } from 'react'
import { FaTrashCanIcon } from 'smarthr-ui'

import { useLatest } from '../../../../hooks/useLatest'
import { useIntl } from '../../../../intl'
import { tv } from '../../../../libs/tv'
import { useRovingToolbar } from '../../hooks/useRovingToolbar'

import { ImageAltPopover } from './ImageAltPopover'
import { ImageWidthPopover } from './ImageWidthPopover'

import type { Editor } from '@tiptap/react'

type ActiveImageInfo = {
  pos: number
  /** container 相対の画像矩形 */
  rect: { top: number; left: number; width: number; height: number }
  /** ProseMirror 編集領域の container 相対矩形（クランプ基準） */
  viewport: { top: number; left: number; width: number; height: number }
}

const findSelectedImagePos = (editor: Editor): number | null => {
  const { state } = editor
  const { from } = state.selection
  const node = state.doc.nodeAt(from)
  if (node && node.type.name === 'image') return from
  return null
}

const resolveImageEl = (rootEl: HTMLElement | null): HTMLElement | null => {
  if (!rootEl) return null
  if (rootEl.tagName === 'IMG') return rootEl
  return (rootEl.querySelector('img') as HTMLElement | null) ?? rootEl
}

const classNameGenerator = tv({
  slots: {
    bar: [
      'smarthr-ui-RichTextEditor-ImageFloatingUI',
      'shr-absolute shr-z-0',
      'shr-inline-flex shr-items-center shr-gap-0.25',
      'shr-border-shorthand shr-rounded-m shr-bg-white shr-p-0.25 shr-shadow-layer-2',
    ],
    deleteButton: [
      'shr-inline-flex shr-items-center shr-justify-center shr-gap-0.25',
      'shr-cursor-pointer shr-border-none shr-bg-transparent shr-px-0.5 shr-py-0.25 shr-text-sm shr-text-black',
      'hover:shr-bg-white-darken',
      'focus-visible:shr-focus-indicator',
    ],
  },
})

const CLASS_NAMES = (() => {
  const { bar, deleteButton } = classNameGenerator()

  return {
    bar: bar(),
    deleteButton: deleteButton(),
  }
})()

type Props = {
  editor: Editor
  containerRef: RefObject<HTMLElement | null>
}

const BAR_GAP = 6
const BAR_HEIGHT = 36

export const ImageFloatingUI: FC<Props> = memo(({ editor, containerRef }) => {
  const { localize } = useIntl()
  const pos = useEditorState({
    editor,
    selector: ({ editor: e }) => (e.isActive('image') ? findSelectedImagePos(e) : null),
  })

  const [info, setInfo] = useState<ActiveImageInfo | null>(null)
  const latest = useLatest({ containerRef })

  useEffect(() => {
    if (pos === null) {
      setInfo(null)
      return
    }

    const updateRect = () => {
      const imgEl = resolveImageEl(editor.view.nodeDOM(pos) as HTMLElement | null)
      const containerEl = latest.containerRef.current
      if (!imgEl || !containerEl) return
      const imgRect = imgEl.getBoundingClientRect()
      const containerRect = containerEl.getBoundingClientRect()
      const proseMirrorRect = editor.view.dom.getBoundingClientRect()
      setInfo({
        pos,
        rect: {
          top: imgRect.top - containerRect.top,
          left: imgRect.left - containerRect.left,
          width: imgRect.width,
          height: imgRect.height,
        },
        viewport: {
          top: proseMirrorRect.top - containerRect.top,
          left: proseMirrorRect.left - containerRect.left,
          width: proseMirrorRect.width,
          height: proseMirrorRect.height,
        },
      })
    }

    updateRect()

    const observed = resolveImageEl(editor.view.nodeDOM(pos) as HTMLElement | null)
    const resizeObserver = new ResizeObserver(updateRect)
    if (observed) resizeObserver.observe(observed)
    if (latest.containerRef.current) resizeObserver.observe(latest.containerRef.current)
    // スクロールは位置の変化なので ResizeObserver で検知できない。capture phase で祖先全部のスクロールを拾う。
    window.addEventListener('scroll', updateRect, true)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('scroll', updateRect, true)
    }
  }, [editor, pos, latest])

  const handleDelete = useCallback(() => {
    if (info) {
      editor.chain().setNodeSelection(info.pos).deleteSelection().run()
    }
  }, [editor, info])

  const handleEscape = useCallback(() => {
    editor.commands.focus()
  }, [editor])

  const { getButtonProps } = useRovingToolbar({ count: 3, onEscape: handleEscape })

  if (!info) return null

  const idealTop = info.rect.top - BAR_HEIGHT - BAR_GAP
  const top = Math.max(idealTop, info.viewport.top)
  const left = info.rect.left

  const toolbarLabel = localize({
    id: 'smarthr-ui/RichTextEditor/imageToolbar',
    defaultText: '画像の操作',
  })
  const deleteLabel = localize({
    id: 'smarthr-ui/RichTextEditor/imageDelete',
    defaultText: '画像を削除',
  })
  const deleteShortLabel = localize({
    id: 'smarthr-ui/RichTextEditor/imageDeleteShort',
    defaultText: '削除',
  })
  return (
    <div role="toolbar" className={CLASS_NAMES.bar} style={{ top, left }} aria-label={toolbarLabel}>
      <ImageAltPopover {...getButtonProps(0)} editor={editor} pos={info.pos} />
      <ImageWidthPopover {...getButtonProps(1)} editor={editor} pos={info.pos} />
      <button
        {...getButtonProps(2)}
        type="button"
        className={CLASS_NAMES.deleteButton}
        aria-label={deleteLabel}
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleDelete}
      >
        <FaTrashCanIcon alt="" />
        {deleteShortLabel}
      </button>
    </div>
  )
})
