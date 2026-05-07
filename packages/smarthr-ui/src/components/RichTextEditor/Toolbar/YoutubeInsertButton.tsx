'use client'

import { type FC, type KeyboardEvent, memo, useCallback, useState } from 'react'

import { useIntl } from '../../../intl'
import { FaCirclePlayIcon } from '../../Icon'
import { useRichTextEditorContext } from '../context/RichTextEditorContext'

import { ToolbarButton } from './ToolbarButton'
import { YoutubeDialog } from './YoutubeDialog'

type Props = {
  tabIndex?: number
  disabled?: boolean
  onKeyDown?: (e: KeyboardEvent) => void
  onFocus?: () => void
  ref?: (el: HTMLButtonElement | null) => void
}

export const YoutubeInsertButton: FC<Props> = memo(
  ({ tabIndex = -1, disabled, onKeyDown, onFocus, ref: refProp }) => {
    const { editor } = useRichTextEditorContext()
    const { localize } = useIntl()
    const [showDialog, setShowDialog] = useState(false)

    const handleClick = useCallback(() => {
      setShowDialog(true)
    }, [])

    const handleSubmit = useCallback(
      (url: string) => {
        editor.chain().focus().setYoutubeVideo({ src: url }).run()
        setShowDialog(false)
      },
      [editor],
    )

    const handleCancel = useCallback(() => {
      setShowDialog(false)
    }, [])

    const label = localize({
      id: 'smarthr-ui/RichTextEditor/youtube',
      defaultText: 'YouTube動画を埋め込む',
    })

    return (
      <>
        <ToolbarButton
          ref={refProp}
          icon={<FaCirclePlayIcon />}
          label={label}
          disabled={disabled}
          tabIndex={tabIndex}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onClick={handleClick}
        />
        {showDialog && <YoutubeDialog onEmbed={handleSubmit} onClose={handleCancel} />}
      </>
    )
  },
)
