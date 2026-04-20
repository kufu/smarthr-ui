'use client'

import { type FC, type FormEvent, memo, useCallback, useState } from 'react'

import { useIntl } from '../../../intl'
import { ControlledFormDialog } from '../../Dialog'
import { FormControl } from '../../FormControl'
import { Input } from '../../Input'

import type { ResponseStatus } from '../../../hooks/useResponseStatus'
import type { ImageUploadResult } from '../types'

type Props = {
  file: File
  onImageUpload: (file: File, formData: FormData) => Promise<ImageUploadResult>
  onSuccess: (result: ImageUploadResult, alt: string) => void
  onCancel: () => void
}

export const AltTextDialog: FC<Props> = memo(({ file, onImageUpload, onSuccess, onCancel }) => {
  const { localize } = useIntl()
  const [alt, setAlt] = useState(file.name)
  const [responseStatus, setResponseStatus] = useState<ResponseStatus | undefined>()

  const handleSubmit = useCallback(
    async (_e: FormEvent<HTMLFormElement>, helpers: { close: () => void }) => {
      setResponseStatus({ status: 'processing' })

      try {
        const formData = new FormData()
        formData.append('file', file)
        const result = await onImageUpload(file, formData)
        onSuccess(result, alt)
        helpers.close()
      } catch {
        setResponseStatus({
          status: 'error',
          text: localize({
            id: 'smarthr-ui/RichTextEditor/imageUploadError',
            defaultText: '画像のアップロードに失敗しました。もう一度お試しください。',
          }),
        })
      }
    },
    [file, alt, onImageUpload, onSuccess, localize],
  )

  const titleText = localize({
    id: 'smarthr-ui/RichTextEditor/imageAltDialogTitle',
    defaultText: '画像の代替テキスト',
  })
  const altLabelText = localize({
    id: 'smarthr-ui/RichTextEditor/imageAltLabel',
    defaultText: '代替テキスト（alt）',
  })
  const helpText = localize({
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
      onClickClose={onCancel}
      responseStatus={responseStatus}
      size="S"
    >
      <FormControl label={altLabelText} helpMessage={helpText}>
        <Input
          name="alt"
          value={alt}
          width="100%"
          disabled={responseStatus?.status === 'processing'}
          onChange={(e) => setAlt(e.target.value)}
        />
      </FormControl>
    </ControlledFormDialog>
  )
})
