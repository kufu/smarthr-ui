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
import { Button, Cluster, FaLinkIcon, FormControl, Input, Stack } from 'smarthr-ui'

import { useLatest } from '../../../hooks/useLatest'
import { useIntl } from '../../../intl'
import { useRichTextEditorContext } from '../context/RichTextEditorContext'
import { useToolbarDropdown } from '../hooks/useToolbarDropdown'
import { readers, useToolbarValue } from '../hooks/useToolbarState'

import { ToolbarButton } from './ToolbarButton'
import { isHttpUrl, isMailtoUrl } from './urlValidation'

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
    const isLink = useToolbarValue(editor, readers.isLink)
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

    const latest = useLatest({
      text,
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
          if (!isHttpUrl(trimmed) && !isMailtoUrl(trimmed)) {
            setError(latest.invalidMessage)
            return
          }

          const { from, to } = editor.state.selection
          const selectedText = editor.state.doc.textBetween(from, to, '')

          if (selectedText && latest.text === selectedText) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: trimmed }).run()
          } else {
            const finalText = latest.text || selectedText || trimmed
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
        handleUnsetLink: () => {
          editor.chain().focus().extendMarkRange('link').unsetLink().run()
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

    // ショートカット（Mod-K）からポップオーバーを開けるよう storage にハンドラを登録。
    //
    // disabled のときは登録しない。disabled はノード選択中（画像・YouTube・水平線）にも
    // 真になるが、エディタ自体は editable のままなのでショートカットは発火してしまう。
    // 登録したままだと、選択中のノードを置き換える形でリンクが挿入され、キーボード操作
    // だけで画像などが失われる。未登録なら拡張側が false を返して握りつぶさない。
    useEffect(() => {
      if (disabled || !editor.storage.linkShortcut) return

      const handler = () => {
        latest.triggerRef.current?.focus()
        setIsOpen(true)
      }

      editor.storage.linkShortcut.openLinkPopover = handler

      return () => {
        if (editor.storage.linkShortcut?.openLinkPopover === handler) {
          editor.storage.linkShortcut.openLinkPopover = null
        }
      }
    }, [disabled, editor, setIsOpen, latest])

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
          disabled={disabled}
          shortcut="Mod-K"
          active={isLink}
          tabIndex={tabIndex}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          onClick={() => setIsOpen((prev) => !prev)}
          onKeyDown={functions.handleTriggerKeyDown}
          onFocus={onFocusProp}
          icon={<FaLinkIcon />}
          label={label}
        />
        {renderDropdown(
          <div ref={popupRef} role="dialog" className={POPUP_CLASS} aria-label={label}>
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
            <form
              noValidate
              onSubmit={functions.handleSubmit}
              onKeyDown={functions.handlePopupKeyDown}
            >
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
                  errorMessages={error || undefined}
                  label={urlLabelText}
                  helpMessage={urlHelpText}
                >
                  <Input
                    ref={urlInputRef}
                    type="url"
                    name="linkUrl"
                    value={url}
                    error={!!error}
                    width="100%"
                    onChange={(e) => {
                      setUrl(e.target.value)
                      if (error) setError('')
                    }}
                  />
                </FormControl>
                <Cluster gap={0.5} justify="space-between">
                  {isLink ? (
                    <Button
                      type="button"
                      variant="text"
                      size="S"
                      onClick={functions.handleUnsetLink}
                      prefix={<FaLinkIcon />}
                    >
                      {unsetText}
                    </Button>
                  ) : (
                    <span />
                  )}
                  <Button type="submit" variant="primary" size="S">
                    {applyText}
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
