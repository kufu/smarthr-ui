'use client'

import { type FC, type FormEvent, type KeyboardEvent, memo, useCallback, useState } from 'react'

import { useIntl } from '../../../intl'
import { Button } from '../../Button'
import { ControlledFormDialog } from '../../Dialog'
import { FormControl } from '../../FormControl'
import { FaLinkIcon } from '../../Icon'
import { Input } from '../../Input'
import { Stack } from '../../Layout'
import { useRichTextEditorContext } from '../context/RichTextEditorContext'
import { useToolbarState } from '../hooks/useToolbarState'

import { ToolbarButton } from './ToolbarButton'

type Props = {
  tabIndex?: number
  disabled?: boolean
  onKeyDown?: (e: KeyboardEvent) => void
  onFocus?: () => void
  ref?: (el: HTMLButtonElement | null) => void
}

export const LinkButton: FC<Props> = memo(
  ({ tabIndex = -1, disabled, onKeyDown, onFocus, ref: refProp }) => {
    const { editor } = useRichTextEditorContext()
    const { localize } = useIntl()
    const state = useToolbarState(editor)
    const [showDialog, setShowDialog] = useState(false)
    const [url, setUrl] = useState('')
    const [text, setText] = useState('')
    const [error, setError] = useState('')

    const handleClick = useCallback(() => {
      const { from, to } = editor.state.selection
      const selectedText = editor.state.doc.textBetween(from, to, '')
      const currentHref = (editor.getAttributes('link').href as string | undefined) ?? ''

      setText(selectedText)
      setUrl(currentHref)
      setError('')
      setShowDialog(true)
    }, [editor])

    const validate = useCallback(
      (value: string): boolean => {
        if (!value.trim()) {
          setError(
            localize({
              id: 'smarthr-ui/RichTextEditor/linkUrlRequired',
              defaultText: 'URLを入力してください',
            }),
          )
          return false
        }
        if (!/^https?:\/\//i.test(value) && !/^mailto:/i.test(value)) {
          setError(
            localize({
              id: 'smarthr-ui/RichTextEditor/linkUrlInvalid',
              defaultText: '有効なURL（http://, https://, mailto:）を入力してください',
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
          const { from, to } = editor.state.selection
          const selectedText = editor.state.doc.textBetween(from, to, '')

          if (selectedText) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
          } else if (text) {
            editor
              .chain()
              .focus()
              .insertContent({
                type: 'text',
                text,
                marks: [{ type: 'link', attrs: { href: url } }],
              })
              .run()
          } else {
            editor
              .chain()
              .focus()
              .insertContent({
                type: 'text',
                text: url,
                marks: [{ type: 'link', attrs: { href: url } }],
              })
              .run()
          }
          helpers.close()
          setShowDialog(false)
        }
      },
      [url, text, validate, editor],
    )

    const handleUnsetLink = useCallback(() => {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      setShowDialog(false)
    }, [editor])

    const handleClose = useCallback(() => {
      setShowDialog(false)
      editor.commands.focus()
    }, [editor])

    const label = localize({ id: 'smarthr-ui/RichTextEditor/link', defaultText: 'リンク' })
    const dialogTitle = localize({
      id: 'smarthr-ui/RichTextEditor/linkDialogTitle',
      defaultText: 'リンクを設定',
    })
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

    return (
      <>
        <ToolbarButton
          ref={refProp}
          icon={<FaLinkIcon />}
          label={label}
          active={state.isLink}
          disabled={disabled}
          tabIndex={tabIndex}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onClick={handleClick}
        />
        {showDialog && (
          <ControlledFormDialog
            isOpen
            heading={dialogTitle}
            actionText={applyText}
            onSubmit={handleSubmit}
            onClickClose={handleClose}
            size="S"
            subActionArea={
              state.isLink ? (
                <Button variant="text" size="S" prefix={<FaLinkIcon />} onClick={handleUnsetLink}>
                  {unsetText}
                </Button>
              ) : undefined
            }
          >
            <Stack gap={1}>
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
                  name="linkUrl"
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
            </Stack>
          </ControlledFormDialog>
        )}
      </>
    )
  },
)
