'use client'

import {
  type FC,
  type FormEvent,
  type KeyboardEvent,
  type RefObject,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import { usePortal } from '../../../hooks/usePortal'
import { useIntl } from '../../../intl'
import { Button } from '../../Button'
import { FormControl } from '../../FormControl'
import { Input } from '../../Input'
import { Cluster, Stack } from '../../Layout'

const POPUP_CLASS = 'shr-border-shorthand shr-rounded-m shr-bg-white shr-p-1 shr-shadow-layer-3'

type Props = {
  anchorRef: RefObject<HTMLElement | null>
  isOpen: boolean
  onInsert: (src: string) => void
  onClose: () => void
}

export const ImageUrlPopover: FC<Props> = memo(({ anchorRef, isOpen, onInsert, onClose }) => {
  const { localize } = useIntl()
  const { createPortal, isChildPortal } = usePortal()
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  const inputRef = useRef<HTMLInputElement>(null)

  const titleText = localize({
    id: 'smarthr-ui/RichTextEditor/imageFromUrl',
    defaultText: 'URLから挿入',
  })
  const urlLabelText = localize({
    id: 'smarthr-ui/RichTextEditor/imageUrlLabel',
    defaultText: '画像URL',
  })
  const requiredMessage = localize({
    id: 'smarthr-ui/RichTextEditor/imageUrlRequired',
    defaultText: 'URLを入力してください',
  })
  const invalidMessage = localize({
    id: 'smarthr-ui/RichTextEditor/imageUrlInvalid',
    defaultText: '有効なURL（http:// または https://）を入力してください',
  })
  const insertText = localize({
    id: 'smarthr-ui/RichTextEditor/imageInsertButton',
    defaultText: '挿入',
  })
  const cancelText = localize({
    id: 'smarthr-ui/RichTextEditor/imageCancelButton',
    defaultText: 'キャンセル',
  })

  useEffect(() => {
    if (!isOpen) {
      setUrl('')
      setError('')

      return
    }

    const rect = anchorRef.current?.getBoundingClientRect()

    if (rect) {
      setPosition({
        top: rect.bottom + 2 + window.pageYOffset,
        left: rect.left + window.pageXOffset,
      })
    }

    requestAnimationFrame(() => inputRef.current?.focus())
  }, [isOpen, anchorRef])

  useEffect(() => {
    if (!isOpen) return

    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      if (!anchorRef.current?.contains(target) && !isChildPortal(target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handler)

    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen, anchorRef, isChildPortal, onClose])

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const trimmed = url.trim()

      if (!trimmed) {
        setError(requiredMessage)

        return
      }

      if (!/^https?:\/\//i.test(trimmed)) {
        setError(invalidMessage)

        return
      }

      onInsert(trimmed)
      onClose()
    },
    [url, requiredMessage, invalidMessage, onInsert, onClose],
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        onClose()
      }
    },
    [onClose],
  )

  if (!isOpen) return null

  return createPortal(
    <div
      role="dialog"
      aria-label={titleText}
      className={`shr-absolute shr-z-overlap-base ${POPUP_CLASS}`}
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <form noValidate onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
        <Stack gap={0.75}>
          <FormControl label={urlLabelText} errorMessages={error || undefined}>
            <Input
              ref={inputRef}
              name="imageUrl"
              type="url"
              value={url}
              width="100%"
              error={!!error}
              onChange={(e) => {
                setUrl(e.target.value)

                if (error) setError('')
              }}
            />
          </FormControl>
          <Cluster gap={0.5} justify="flex-end">
            <Button type="button" size="S" variant="secondary" onClick={onClose}>
              {cancelText}
            </Button>
            <Button type="submit" size="S" variant="primary">
              {insertText}
            </Button>
          </Cluster>
        </Stack>
      </form>
    </div>,
  )
})
