'use client'

import { isValidYoutubeUrl } from '@tiptap/extension-youtube'
import {
  type FC,
  type FormEvent,
  type KeyboardEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Button, Cluster, FaCirclePlayIcon, FormControl, Input, Stack } from 'smarthr-ui'

import { useIntl } from '../../../intl'
import { useRichTextEditorContext } from '../context/RichTextEditorContext'
import { useToolbarDropdown } from '../hooks/useToolbarDropdown'

import { ToolbarButton } from './ToolbarButton'

const POPUP_CLASS = 'shr-border-shorthand shr-rounded-m shr-bg-white shr-p-1 shr-shadow-layer-3'

type Props = {
  tabIndex?: number
  disabled?: boolean
  onKeyDown?: (e: KeyboardEvent) => void
  onFocus?: () => void
  ref?: (el: HTMLButtonElement | null) => void
}

export const YoutubeInsertButton: FC<Props> = memo(
  ({ tabIndex = -1, disabled, onKeyDown: onKeyDownProp, onFocus: onFocusProp, ref: refProp }) => {
    const { editor } = useRichTextEditorContext()
    const { localize } = useIntl()
    const { isOpen, setIsOpen, triggerRef, renderDropdown } = useToolbarDropdown()
    const [url, setUrl] = useState('')
    const [error, setError] = useState('')
    const popupRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const label = localize({
      id: 'smarthr-ui/RichTextEditor/youtube',
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
    const cancelText = localize({
      id: 'smarthr-ui/RichTextEditor/youtubeCancelButton',
      defaultText: 'キャンセル',
    })
    const requiredMessage = localize({
      id: 'smarthr-ui/RichTextEditor/youtubeUrlRequired',
      defaultText: 'URLを入力してください',
    })
    const invalidMessage = localize({
      id: 'smarthr-ui/RichTextEditor/youtubeInvalidUrl',
      defaultText: '有効なYouTube URLを入力してください',
    })

    const closePopup = useCallback(() => {
      setIsOpen(false)
      triggerRef.current?.focus()
    }, [setIsOpen, triggerRef])

    const handleSubmit = useCallback(
      (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const trimmed = url.trim()
        if (!trimmed) {
          setError(requiredMessage)
          return
        }
        if (!isValidYoutubeUrl(trimmed)) {
          setError(invalidMessage)
          return
        }
        editor.chain().focus().setYoutubeVideo({ src: trimmed }).run()
        setIsOpen(false)
      },
      [editor, url, requiredMessage, invalidMessage, setIsOpen],
    )

    const handlePopupKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault()
          e.stopPropagation()
          closePopup()
        }
      },
      [closePopup],
    )

    const handleTriggerKeyDown = useCallback(
      (e: KeyboardEvent) => {
        switch (e.key) {
          case 'Enter':
          case ' ':
          case 'ArrowDown':
            e.preventDefault()
            e.stopPropagation()
            setIsOpen(true)
            break
          default:
            onKeyDownProp?.(e)
        }
      },
      [setIsOpen, onKeyDownProp],
    )

    // ポップアップ表示時にURL Inputへフォーカス、閉じたら入力をリセット
    useEffect(() => {
      if (isOpen) {
        requestAnimationFrame(() => {
          inputRef.current?.focus()
        })
      } else {
        setUrl('')
        setError('')
      }
    }, [isOpen])

    return (
      <>
        <ToolbarButton
          ref={(el) => {
            triggerRef.current = el
            refProp?.(el)
          }}
          disabled={disabled}
          tabIndex={tabIndex}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          onClick={() => setIsOpen((prev) => !prev)}
          onKeyDown={handleTriggerKeyDown}
          onFocus={onFocusProp}
          icon={<FaCirclePlayIcon />}
          label={label}
        />
        {renderDropdown(
          <div ref={popupRef} role="dialog" className={POPUP_CLASS} aria-label={label}>
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
            <form noValidate onSubmit={handleSubmit} onKeyDown={handlePopupKeyDown}>
              <Stack gap={0.75}>
                <FormControl
                  errorMessages={error || undefined}
                  label={urlLabelText}
                  helpMessage={urlHelpText}
                >
                  <Input
                    ref={inputRef}
                    type="url"
                    name="youtubeUrl"
                    value={url}
                    error={!!error}
                    width="100%"
                    onChange={(e) => {
                      setUrl(e.target.value)
                      if (error) setError('')
                    }}
                  />
                </FormControl>
                <Cluster gap={0.5} justify="flex-end">
                  <Button type="button" variant="secondary" size="S" onClick={closePopup}>
                    {cancelText}
                  </Button>
                  <Button type="submit" variant="primary" size="S">
                    {embedText}
                  </Button>
                </Cluster>
              </Stack>
            </form>
          </div>,
        )}
      </>
    )
  },
)
