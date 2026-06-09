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
import { tv } from 'tailwind-variants'

import { useIntl } from '../../../../intl'
import { Button } from '../../../Button'
import { FormControl } from '../../../FormControl'
import { FaPenToSquareIcon } from '../../../Icon'
import { Input } from '../../../Input'
import { Cluster, Stack } from '../../../Layout'
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
    menu: ['shr-border-shorthand shr-rounded-m shr-bg-white shr-p-1 shr-shadow-layer-3'],
  },
})

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
    const classNames = classNameGenerator()
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
      id: 'smarthr-ui/RichTextEditor/imageInsertButton',
      defaultText: '挿入',
    })

    useEffect(() => {
      if (!isOpen) return

      const node = editor.state.doc.nodeAt(pos)

      setAlt(typeof node?.attrs.alt === 'string' ? node.attrs.alt : '')
      requestAnimationFrame(() => inputRef.current?.focus())
    }, [isOpen, editor, pos])

    const closePopup = useCallback(() => {
      setIsOpen(false)
      triggerRef.current?.focus()
    }, [setIsOpen, triggerRef])

    const handleSubmit = useCallback(
      (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        editor.chain().setNodeSelection(pos).updateAttributes('image', { alt }).run()
        setIsOpen(false)
      },
      [editor, pos, alt, setIsOpen],
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

    return (
      <>
        <button
          ref={(el) => {
            triggerRef.current = el
            refProp?.(el)
          }}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          tabIndex={tabIndex}
          className={classNames.trigger()}
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
          <div role="dialog" aria-label={label} className={classNames.menu()}>
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
            <form noValidate onSubmit={handleSubmit} onKeyDown={handlePopupKeyDown}>
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
                  <Button type="submit" size="S" variant="primary">
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
