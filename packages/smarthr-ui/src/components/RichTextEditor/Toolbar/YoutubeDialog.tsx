'use client'

import { isValidYoutubeUrl } from '@tiptap/extension-youtube'
import { type FC, type FormEvent, memo, useCallback, useState } from 'react'

import { useIntl } from '../../../intl'
import { ControlledFormDialog } from '../../Dialog'
import { FormControl } from '../../FormControl'
import { Input } from '../../Input'

type Props = {
  onEmbed: (url: string) => void
  onClose: () => void
}

export const YoutubeDialog: FC<Props> = memo(({ onEmbed, onClose }) => {
  const { localize } = useIntl()
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

  const validate = useCallback(
    (value: string): boolean => {
      if (!value.trim()) {
        setError(
          localize({
            id: 'smarthr-ui/RichTextEditor/youtubeUrlRequired',
            defaultText: 'URLを入力してください',
          }),
        )
        return false
      }
      if (!isValidYoutubeUrl(value)) {
        setError(
          localize({
            id: 'smarthr-ui/RichTextEditor/youtubeInvalidUrl',
            defaultText: '有効なYouTube URLを入力してください',
          }),
        )
        return false
      }
      setError('')
      return true
    },
    [localize],
  )

  const handleSubmit = useCallback(
    (_e: FormEvent<HTMLFormElement>, helpers: { close: () => void }) => {
      if (validate(url)) {
        onEmbed(url)
        helpers.close()
      }
    },
    [url, validate, onEmbed],
  )

  const titleText = localize({
    id: 'smarthr-ui/RichTextEditor/youtubeDialogTitle',
    defaultText: 'YouTube動画を埋め込む',
  })
  const urlLabelText = localize({
    id: 'smarthr-ui/RichTextEditor/youtubeUrlLabel',
    defaultText: 'YouTube URL',
  })
  const urlHelpText = localize({
    id: 'smarthr-ui/RichTextEditor/youtubeUrlHelp',
    defaultText: 'youtube.com または youtu.be のURLを入力してください',
  })
  const embedText = localize({
    id: 'smarthr-ui/RichTextEditor/youtubeEmbedButton',
    defaultText: '埋め込む',
  })

  return (
    <ControlledFormDialog
      isOpen
      heading={titleText}
      actionText={embedText}
      onSubmit={handleSubmit}
      onClickClose={onClose}
      size="S"
    >
      <FormControl
        label={urlLabelText}
        helpMessage={urlHelpText}
        errorMessages={error || undefined}
      >
        <Input
          name="youtubeUrl"
          type="url"
          value={url}
          error={!!error}
          width="100%"
          onChange={(e) => {
            setUrl(e.target.value)
            if (error) setError('')
          }}
        />
      </FormControl>
    </ControlledFormDialog>
  )
})
