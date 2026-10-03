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
import { Button, Cluster, FaPenToSquareIcon, FormControl, Input, Stack } from 'smarthr-ui'

import { useMergeRefs } from '../../../../hooks/client/useMergeRefs'
import { useLatest } from '../../../../hooks/useLatest'
import { useIntl } from '../../../../intl'
import { tv } from '../../../../libs/tv'
import { TOOLBAR_POPUP_CLASS_NAME } from '../../Toolbar/toolbarItemStyle'
import { useToolbarDropdown } from '../../hooks/useToolbarDropdown'

import type { Editor } from '@tiptap/react'

const classNameGenerator = tv({
  slots: {
    trigger: [
      'shr-inline-flex shr-items-center shr-justify-center shr-gap-0.25',
      'shr-cursor-pointer shr-border-none shr-bg-transparent shr-px-0.5 shr-py-0.25 shr-text-sm shr-text-black',
      'hover:shr-bg-white-darken',
      'focus-visible:shr-focus-indicator',
    ],
    menu: TOOLBAR_POPUP_CLASS_NAME,
  },
})

const CLASS_NAMES = (() => {
  const { menu, trigger } = classNameGenerator()

  return {
    menu: menu(),
    trigger: trigger(),
  }
})()

type Props = {
  editor: Editor
  pos: number
  tabIndex?: number
  onKeyDown?: (e: KeyboardEvent) => void
  onFocus?: () => void
  ref?: (el: HTMLButtonElement | null) => void
}

export const ImageAltPopover: FC<Props> = memo(
  ({ editor, pos, tabIndex = -1, onKeyDown, onFocus, ref: refProp }) => {
    const { localize } = useIntl()
    const { isOpen, setIsOpen, triggerRef, renderDropdown } = useToolbarDropdown()
    const mergedTriggerRef = useMergeRefs(triggerRef, refProp)
    const [alt, setAlt] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    const label = localize({
      id: 'smarthr-ui/RichTextEditor/imageAltLabel',
      defaultText: '代替テキスト（alt）',
    })
    const helpText = localize({
      id: 'smarthr-ui/RichTextEditor/imageAltHelp',
      defaultText: '画像の内容を説明してください',
    })
    const applyLabel = localize({
      id: 'smarthr-ui/RichTextEditor/imageApplyButton',
      defaultText: '適用',
    })

    useEffect(() => {
      if (!isOpen) return

      const node = editor.state.doc.nodeAt(pos)

      setAlt(typeof node?.attrs.alt === 'string' ? node.attrs.alt : '')
      requestAnimationFrame(() => inputRef.current?.focus())
    }, [isOpen, editor, pos])

    const latest = useLatest({ pos, alt, triggerRef })

    const functions = useMemo(() => {
      const closePopup = () => {
        setIsOpen(false)
        latest.triggerRef.current?.focus()
      }

      return {
        handleSubmit: (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault()
          e.stopPropagation()

          editor
            .chain()
            .setNodeSelection(latest.pos)
            .updateAttributes('image', { alt: latest.alt })
            .run()
          setIsOpen(false)
        },
        handlePopupKeyDown: (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            e.preventDefault()
            e.stopPropagation()
            closePopup()
          }
        },
      }
    }, [editor, setIsOpen, latest])

    return (
      <>
        <button
          ref={mergedTriggerRef}
          type="button"
          tabIndex={tabIndex}
          className={CLASS_NAMES.trigger}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setIsOpen((prev) => !prev)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              e.stopPropagation()
              setIsOpen(true)
              return
            }
            onKeyDown?.(e)
          }}
          onFocus={onFocus}
        >
          <FaPenToSquareIcon alt="" />
          {label}
        </button>
        {renderDropdown(
          <div role="dialog" className={CLASS_NAMES.menu} aria-label={label}>
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
            <form
              noValidate
              onSubmit={functions.handleSubmit}
              onKeyDown={functions.handlePopupKeyDown}
            >
              <Stack gap={0.75}>
                <FormControl label={label} helpMessage={helpText}>
                  <Input
                    ref={inputRef}
                    name="imageAlt"
                    value={alt}
                    width="20em"
                    onChange={(e) => setAlt(e.target.value)}
                  />
                </FormControl>
                <Cluster gap={0.5} justify="flex-end">
                  <Button type="submit" variant="primary" size="S">
                    {applyLabel}
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
