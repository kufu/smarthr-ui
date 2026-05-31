'use client'

import { type FC, type RefObject, memo, useCallback } from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../../../intl'
import { FaTrashCanIcon } from '../../../Icon'
import { useRovingToolbar } from '../../hooks/useRovingToolbar'

import { ImageAltPopover } from './ImageAltPopover'
import { ImageWidthPopover } from './ImageWidthPopover'
import { useActiveImageRect } from './useActiveImageRect'

import type { Editor } from '@tiptap/react'

const classNameGenerator = tv({
  slots: {
    bar: [
      'smarthr-ui-RichTextEditor-ImageFloatingUI',
      'shr-absolute shr-z-overlap-base',
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

type Props = {
  editor: Editor
  containerRef: RefObject<HTMLElement | null>
}

const BAR_GAP = 6
const BAR_HEIGHT = 36

export const ImageFloatingUI: FC<Props> = memo(({ editor, containerRef }) => {
  const { localize } = useIntl()
  const info = useActiveImageRect(editor, containerRef)
  const classNames = classNameGenerator()

  const handleDelete = useCallback(() => {
    if (info) {
      editor.chain().setNodeSelection(info.pos).deleteSelection().run()
    }
  }, [editor, info])

  const handleEscape = useCallback(() => {
    editor.commands.focus()
  }, [editor])

  const { getButtonProps } = useRovingToolbar({ onEscape: handleEscape })

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

  if (!info) return null

  const idealTop = info.rect.top - BAR_HEIGHT - BAR_GAP
  const top = Math.max(idealTop, info.viewport.top)
  const left = info.rect.left

  return (
    <div
      role="toolbar"
      aria-label={toolbarLabel}
      className={classNames.bar()}
      style={{ top, left }}
    >
      <ImageAltPopover {...getButtonProps(0, 3)} editor={editor} pos={info.pos} />
      <ImageWidthPopover {...getButtonProps(1, 3)} editor={editor} pos={info.pos} />
      <button
        {...getButtonProps(2, 3)}
        type="button"
        aria-label={deleteLabel}
        className={classNames.deleteButton()}
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleDelete}
      >
        <FaTrashCanIcon alt="" />
        {deleteShortLabel}
      </button>
    </div>
  )
})
