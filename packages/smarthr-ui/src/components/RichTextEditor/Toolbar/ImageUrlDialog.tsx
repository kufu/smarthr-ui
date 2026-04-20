'use client'

import { type FC, type FormEvent, memo, useCallback, useState } from 'react'

import { useIntl } from '../../../intl'
import { ControlledFormDialog } from '../../Dialog'
import { FormControl } from '../../FormControl'
import { Input } from '../../Input'
import { Stack } from '../../Layout'

type Props = {
  onInsert: (src: string, alt: string) => void
  onClose: () => void
}

export const ImageUrlDialog: FC<Props> = memo(({ onInsert, onClose }) => {
  const { localize } = useIntl()
  const [url, setUrl] = useState('')
  const [alt, setAlt] = useState('')
  const [error, setError] = useState('')

  const validate = useCallback(
    (value: string): boolean => {
      if (!value.trim()) {
        setError(
          localize({
            id: 'smarthr-ui/RichTextEditor/imageUrlRequired',
            defaultText: 'URLを入力してください',
          }),
        )
        return false
      }
      if (!/^https?:\/\//i.test(value)) {
        setError(
          localize({
            id: 'smarthr-ui/RichTextEditor/imageUrlInvalid',
            defaultText: '有効なURL（http:// または https://）を入力してください',
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
        onInsert(url, alt)
        helpers.close()
      }
    },
    [url, alt, validate, onInsert],
  )

  const titleText = localize({
    id: 'smarthr-ui/RichTextEditor/imageUrlDialogTitle',
    defaultText: 'URLから画像を挿入',
  })
  const urlLabelText = localize({
    id: 'smarthr-ui/RichTextEditor/imageUrlLabel',
    defaultText: '画像URL',
  })
  const altLabelText = localize({
    id: 'smarthr-ui/RichTextEditor/imageAltLabel',
    defaultText: '代替テキスト（alt）',
  })
  const altHelp = localize({
    id: 'smarthr-ui/RichTextEditor/imageAltHelp',
    defaultText: '画像の内容を説明してください',
  })
  const insertText = localize({
    id: 'smarthr-ui/RichTextEditor/imageInsertButton',
    defaultText: '挿入',
  })

  return (
    <ControlledFormDialog
      isOpen
      heading={titleText}
      actionText={insertText}
      onSubmit={handleSubmit}
      onClickClose={onClose}
      size="S"
    >
      <Stack gap={1}>
        <FormControl label={urlLabelText} errorMessages={error || undefined}>
          <Input
            name="url"
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
        <FormControl label={altLabelText} helpMessage={altHelp}>
          <Input name="alt" value={alt} width="100%" onChange={(e) => setAlt(e.target.value)} />
        </FormControl>
      </Stack>
    </ControlledFormDialog>
  )
})
