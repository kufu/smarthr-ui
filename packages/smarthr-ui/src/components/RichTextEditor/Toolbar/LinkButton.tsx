'use client'

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

import { useIntl } from '../../../intl'
import { Button } from '../../Button'
import { FormControl } from '../../FormControl'
import { FaLinkIcon } from '../../Icon'
import { Input } from '../../Input'
import { Cluster, Stack } from '../../Layout'
import { useRichTextEditorContext } from '../context/RichTextEditorContext'
import { useToolbarDropdown } from '../hooks/useToolbarDropdown'
import { useToolbarState } from '../hooks/useToolbarState'

import { ToolbarButton } from './ToolbarButton'

const POPUP_CLASS = 'shr-border-shorthand shr-rounded-m shr-bg-white shr-p-1 shr-shadow-layer-3'

type Props = {
  tabIndex?: number
  disabled?: boolean
  onKeyDown?: (e: KeyboardEvent) => void
  onFocus?: () => void
  ref?: (el: HTMLButtonElement | null) => void
}

export const LinkButton: FC<Props> = memo(
  ({ tabIndex = -1, disabled, onKeyDown: onKeyDownProp, onFocus: onFocusProp, ref: refProp }) => {
    const { editor } = useRichTextEditorContext()
    const { localize } = useIntl()
    const state = useToolbarState(editor)
    const { isOpen, setIsOpen, triggerRef, renderDropdown } = useToolbarDropdown()
    const [text, setText] = useState('')
    const [url, setUrl] = useState('')
    const [error, setError] = useState('')
    const popupRef = useRef<HTMLDivElement>(null)
    const urlInputRef = useRef<HTMLInputElement>(null)

    const label = localize({ id: 'smarthr-ui/RichTextEditor/link', defaultText: 'リンク' })
    const textLabel = localize({
      id: 'smarthr-ui/RichTextEditor/linkTextLabel',
      defaultText: 'テキスト',
    })
    const urlLabelText = localize({
      id: 'smarthr-ui/RichTextEditor/linkUrlLabel',
      defaultText: 'リンク',
    })
    const urlHelpText = localize({
      id: 'smarthr-ui/RichTextEditor/linkUrlHelp',
      defaultText: 'http://, https://, mailto: から始まるURLを入力してください',
    })
    const applyText = localize({
      id: 'smarthr-ui/RichTextEditor/linkSetButton',
      defaultText: '適用',
    })
    const cancelText = localize({
      id: 'smarthr-ui/RichTextEditor/linkCancelButton',
      defaultText: 'キャンセル',
    })
    const unsetText = localize({
      id: 'smarthr-ui/RichTextEditor/linkUnsetButton',
      defaultText: 'リンクを解除',
    })
    const requiredMessage = localize({
      id: 'smarthr-ui/RichTextEditor/linkUrlRequired',
      defaultText: 'URLを入力してください',
    })
    const invalidMessage = localize({
      id: 'smarthr-ui/RichTextEditor/linkUrlInvalid',
      defaultText: '有効なURLを入力してください',
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
        if (!/^https?:\/\//i.test(trimmed) && !/^mailto:/i.test(trimmed)) {
          setError(invalidMessage)
          return
        }

        const { from, to } = editor.state.selection
        const selectedText = editor.state.doc.textBetween(from, to, '')

        if (selectedText && text === selectedText) {
          editor.chain().focus().extendMarkRange('link').setLink({ href: trimmed }).run()
        } else {
          const finalText = text || selectedText || trimmed
          editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .insertContent({
              type: 'text',
              text: finalText,
              marks: [{ type: 'link', attrs: { href: trimmed } }],
            })
            .run()
        }
        setIsOpen(false)
      },
      [editor, url, text, requiredMessage, invalidMessage, setIsOpen],
    )

    const handleUnsetLink = useCallback(() => {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      setIsOpen(false)
    }, [editor, setIsOpen])

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

    // ポップアップ表示時: 選択範囲・既存リンクから値を投入し URL Input にフォーカス
    // 閉じた時: 入力値とエラーをリセット
    useEffect(() => {
      if (isOpen) {
        if (editor.isActive('link')) {
          editor.chain().extendMarkRange('link').run()
        }
        const { from, to } = editor.state.selection
        const selectedText = editor.state.doc.textBetween(from, to, '')
        const currentHref = (editor.getAttributes('link').href as string | undefined) ?? ''
        setText(selectedText)
        setUrl(currentHref)
        setError('')
        requestAnimationFrame(() => {
          urlInputRef.current?.focus()
        })
      } else {
        setText('')
        setUrl('')
        setError('')
      }
      // editor は実体変わらないため依存に含めない（YouTube 実装と同じ方針）
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen])

    return (
      <>
        <ToolbarButton
          ref={(el) => {
            triggerRef.current = el
            refProp?.(el)
          }}
          icon={<FaLinkIcon />}
          label={label}
          active={state.isLink}
          disabled={disabled}
          tabIndex={tabIndex}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          onClick={() => setIsOpen((prev) => !prev)}
          onKeyDown={handleTriggerKeyDown}
          onFocus={onFocusProp}
        />
        {renderDropdown(
          <div ref={popupRef} role="dialog" aria-label={label} className={POPUP_CLASS}>
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
            <form noValidate onSubmit={handleSubmit} onKeyDown={handlePopupKeyDown}>
              <Stack gap={0.75}>
                <FormControl label={textLabel}>
                  <Input
                    name="linkText"
                    value={text}
                    width="100%"
                    onChange={(e) => setText(e.target.value)}
                  />
                </FormControl>
                <FormControl
                  label={urlLabelText}
                  helpMessage={urlHelpText}
                  errorMessages={error || undefined}
                >
                  <Input
                    ref={urlInputRef}
                    name="linkUrl"
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
                <Cluster gap={0.5} justify="space-between">
                  {state.isLink ? (
                    <Button
                      type="button"
                      variant="text"
                      size="S"
                      prefix={<FaLinkIcon />}
                      onClick={handleUnsetLink}
                    >
                      {unsetText}
                    </Button>
                  ) : (
                    <span />
                  )}
                  <Cluster gap={0.5}>
                    <Button type="button" size="S" variant="secondary" onClick={closePopup}>
                      {cancelText}
                    </Button>
                    <Button type="submit" size="S" variant="primary">
                      {applyText}
                    </Button>
                  </Cluster>
                </Cluster>
              </Stack>
            </form>
          </div>,
        )}
      </>
    )
  },
)
