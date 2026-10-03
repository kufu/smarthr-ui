'use client'

import {
  type FC,
  type FormEvent,
  type KeyboardEvent,
  type RefObject,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Button, Cluster, FormControl, Input, Stack } from 'smarthr-ui'

import { useLatest } from '../../../hooks/useLatest'
import { usePortal } from '../../../hooks/usePortal'
import { useIntl } from '../../../intl'

import { isHttpUrl } from './urlValidation'

const POPUP_CLASS = 'shr-border-shorthand shr-rounded-m shr-bg-white shr-p-1 shr-shadow-layer-3'

type Props = {
  anchorRef: RefObject<HTMLElement | null>
  isOpen: boolean
  handleInsert: (src: string) => void
  handleClose: () => void
}

export const ImageUrlPopover: FC<Props> = memo(
  ({ anchorRef, isOpen, handleInsert, handleClose }) => {
    const { localize } = useIntl()
    const { createPortal, isChildPortal } = usePortal()
    const [url, setUrl] = useState('')
    const [error, setError] = useState('')
    const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
    const inputRef = useRef<HTMLInputElement>(null)

    const requiredMessage = localize({
      id: 'smarthr-ui/RichTextEditor/imageUrlRequired',
      defaultText: 'URLを入力してください',
    })
    const invalidMessage = localize({
      id: 'smarthr-ui/RichTextEditor/imageUrlInvalid',
      defaultText: '有効なURL（http:// または https://）を入力してください',
    })

    const latest = useLatest({
      url,
      requiredMessage,
      invalidMessage,
      anchorRef,
      handleInsert,
      handleClose,
    })

    useEffect(() => {
      if (!isOpen) {
        setUrl('')
        setError('')

        return
      }

      const rect = latest.anchorRef.current?.getBoundingClientRect()

      if (rect) {
        setPosition({
          top: rect.bottom + 2 + window.pageYOffset,
          left: rect.left + window.pageXOffset,
        })
      }

      requestAnimationFrame(() => inputRef.current?.focus())
    }, [isOpen, latest])

    useEffect(() => {
      if (!isOpen) return

      const handler = (e: MouseEvent) => {
        const target = e.target as HTMLElement

        if (!latest.anchorRef.current?.contains(target) && !isChildPortal(target)) {
          latest.handleClose()
        }
      }

      document.addEventListener('mousedown', handler)

      return () => document.removeEventListener('mousedown', handler)
    }, [isOpen, isChildPortal, latest])

    const functions = useMemo(() => {
      /**
       * 閉じる操作ではトリガーへフォーカスを戻す。
       * 外側クリックでは呼ばない。クリック先からフォーカスを奪うことになる。
       */
      const closeAndRestoreFocus = () => {
        latest.handleClose()

        const anchor = latest.anchorRef.current

        // 外れた/無効なトリガーへ戻すとフォーカスが body へ落ちる
        if (anchor?.isConnected && !anchor.matches(':disabled')) {
          anchor.focus()
        }
      }

      return {
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
          latest.handleClose()
        },
        handleKeyDown: (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            e.preventDefault()
            e.stopPropagation()
            closeAndRestoreFocus()
          }
        },
      }
    }, [latest])

    if (!isOpen) return null

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
    return createPortal(
      <div
        role="dialog"
        className={`shr-absolute shr-z-overlap-base ${POPUP_CLASS}`}
        style={{ top: `${position.top}px`, left: `${position.left}px` }}
        aria-label={titleText}
      >
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <form noValidate onSubmit={functions.handleSubmit} onKeyDown={functions.handleKeyDown}>
          <Stack gap={0.75}>
            <FormControl errorMessages={error || undefined} label={urlLabelText}>
              <Input
                ref={inputRef}
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
      </div>,
    )
  },
)
