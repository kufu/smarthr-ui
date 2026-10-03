'use client'

import {
  type FC,
  type FormEvent,
  type KeyboardEvent,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Button, Cluster, FaCirclePlayIcon, FormControl, Input, Stack } from 'smarthr-ui'

import { useMergeRefs } from '../../../hooks/client/useMergeRefs'
import { useLatest } from '../../../hooks/useLatest'
import { useIntl } from '../../../intl'
import { useRichTextEditorContext } from '../context/RichTextEditorContext'
import { normalizeYoutubeUrl } from '../extensions/youtubeUrl'
import { useToolbarDropdown } from '../hooks/useToolbarDropdown'

import { ToolbarButton } from './ToolbarButton'
import { TOOLBAR_POPUP_CLASS_NAME } from './toolbarItemStyle'

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
    const mergedTriggerRef = useMergeRefs(triggerRef, refProp)
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
    const requiredMessage = localize({
      id: 'smarthr-ui/RichTextEditor/youtubeUrlRequired',
      defaultText: 'URLを入力してください',
    })
    const invalidMessage = localize({
      id: 'smarthr-ui/RichTextEditor/youtubeInvalidUrl',
      defaultText: '有効なYouTube URLを入力してください',
    })

    const latest = useLatest({
      url,
      requiredMessage,
      invalidMessage,
      triggerRef,
      onKeyDown: onKeyDownProp,
    })

    const functions = useMemo(() => {
      const closePopup = () => {
        setIsOpen(false)
        latest.triggerRef.current?.focus()
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
          const normalized = normalizeYoutubeUrl(trimmed)
          if (!normalized) {
            setError(latest.invalidMessage)
            return
          }
          editor.chain().focus().setYoutubeVideo(normalized).run()
          setIsOpen(false)
        },
        handlePopupKeyDown: (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            e.preventDefault()
            e.stopPropagation()
            closePopup()
          }
        },
        handleTriggerKeyDown: (e: KeyboardEvent) => {
          switch (e.key) {
            case 'Enter':
            case ' ':
            case 'ArrowDown':
              e.preventDefault()
              e.stopPropagation()
              setIsOpen(true)
              break
            default:
              latest.onKeyDown?.(e)
          }
        },
      }
    }, [editor, setIsOpen, latest])

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
          ref={mergedTriggerRef}
          disabled={disabled}
          tabIndex={tabIndex}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          onClick={() => setIsOpen((prev) => !prev)}
          onKeyDown={functions.handleTriggerKeyDown}
          onFocus={onFocusProp}
          icon={<FaCirclePlayIcon />}
          label={label}
        />
        {renderDropdown(
          <div ref={popupRef} role="dialog" className={TOOLBAR_POPUP_CLASS_NAME} aria-label={label}>
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
            <form
              noValidate
              onSubmit={functions.handleSubmit}
              onKeyDown={functions.handlePopupKeyDown}
            >
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
                <Cluster justify="flex-end">
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
