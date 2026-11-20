'use client'

import { type FC, memo, useCallback } from 'react'
import { FaTrashCanIcon } from 'smarthr-ui'

import { useIntl } from '../../../intl'

import { MEDIA_TOOLBAR_BUTTON_CLASS_NAME } from './mediaToolbarStyle'

import type { RovingButtonProps } from '../hooks/useRovingToolbar'
import type { Editor } from '@tiptap/react'

type Props = RovingButtonProps & {
  editor: Editor
  pos: number
  label: string
}

export const MediaDeleteButton: FC<Props> = memo(({ editor, pos, label, ...rest }) => {
  const { localize } = useIntl()

  const handleClick = useCallback(() => {
    editor.chain().focus().setNodeSelection(pos).deleteSelection().run()
  }, [editor, pos])

  return (
    <button
      {...rest}
      type="button"
      className={MEDIA_TOOLBAR_BUTTON_CLASS_NAME}
      aria-label={label}
      onMouseDown={(e) => e.preventDefault()}
      onClick={handleClick}
    >
      <FaTrashCanIcon alt="" />
      {localize({ id: 'smarthr-ui/RichTextEditor/mediaDeleteShort', defaultText: '削除' })}
    </button>
  )
})
