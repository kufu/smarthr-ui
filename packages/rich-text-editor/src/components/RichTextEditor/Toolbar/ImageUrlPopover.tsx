'use client'

import { type FC, type FormEvent, type KeyboardEvent, memo, useMemo, useState } from 'react'
import { Button, Cluster, FormControl, Input, Stack } from 'smarthr-ui'

import { useLatest } from '../../../hooks/useLatest'
import { useIntl } from '../../../intl'

import { TOOLBAR_POPUP_CLASS_NAME } from './toolbarItemStyle'
import { isHttpUrl } from './urlValidation'

const DIALOG_CLASS_NAME = `${TOOLBAR_POPUP_CLASS_NAME} shr-box-border shr-w-[20em] shr-max-w-full`

type Props = {
  handleInsert: (src: string) => void
  handleCancel: () => void
}

export const ImageUrlPopover: FC<Props> = memo(({ handleInsert, handleCancel }) => {
  const { localize } = useIntl()
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

  const requiredMessage = localize({
    id: 'smarthr-ui/RichTextEditor/imageUrlRequired',
    defaultText: 'URLを入力してください',
  })
  const invalidMessage = localize({
    id: 'smarthr-ui/RichTextEditor/imageUrlInvalid',
    defaultText: '有効なURL（http:// または https://）を入力してください',
  })

  const latest = useLatest({ url, requiredMessage, invalidMessage, handleInsert, handleCancel })

  const functions = useMemo(
    () => ({
      focusOnMount: (node: HTMLInputElement | null) => {
        if (!node) return

        // 開いた直後は位置を測る間 visibility:hidden で、フォーカスを受け付けない
        const frame = requestAnimationFrame(() => node.focus())

        return () => cancelAnimationFrame(frame)
      },
      handleSubmit: (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()

        const trimmed = latest.url.trim()

        if (!trimmed) {
          setError(latest.requiredMessage)

          return
        }

        if (!isHttpUrl(trimmed)) {
          setError(latest.invalidMessage)

          return
        }

        latest.handleInsert(trimmed)
      },
      handleKeyDown: (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault()
          e.stopPropagation()
          latest.handleCancel()
        }
      },
    }),
    [latest],
  )

  const titleText = localize({
    id: 'smarthr-ui/RichTextEditor/imageFromUrl',
    defaultText: 'URLから挿入',
  })
  const urlLabelText = localize({
    id: 'smarthr-ui/RichTextEditor/imageUrlLabel',
    defaultText: '画像URL',
  })
  const insertText = localize({
    id: 'smarthr-ui/RichTextEditor/imageInsertButton',
    defaultText: '挿入',
  })

  return (
    <div role="dialog" className={DIALOG_CLASS_NAME} aria-label={titleText}>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <form noValidate onSubmit={functions.handleSubmit} onKeyDown={functions.handleKeyDown}>
        <Stack gap={0.75}>
          <FormControl errorMessages={error || undefined} label={urlLabelText}>
            <Input
              ref={functions.focusOnMount}
              type="url"
              name="imageUrl"
              value={url}
              error={!!error}
              width="100%"
              onChange={(e) => {
                setUrl(e.target.value)

                if (error) setError('')
              }}
            />
          </FormControl>
          <Cluster justify="flex-end">
            <Button type="submit" variant="primary" size="S">
              {insertText}
            </Button>
          </Cluster>
        </Stack>
      </form>
    </div>
  )
})
