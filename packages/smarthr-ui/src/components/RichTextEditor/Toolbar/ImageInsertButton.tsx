'use client'

import {
  type ChangeEvent,
  type FC,
  type KeyboardEvent,
  memo,
  useCallback,
  useRef,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../../intl'
import { FaImageIcon } from '../../Icon'
import { useRichTextEditorContext } from '../context/RichTextEditorContext'
import { useToolbarDropdown } from '../hooks/useToolbarDropdown'

import { AltTextDialog } from './AltTextDialog'
import { ImageUrlDialog } from './ImageUrlDialog'
import { ToolbarButton } from './ToolbarButton'

import type { ImageUploadResult } from '../types'

const DEFAULT_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

const classNameGenerator = tv({
  slots: {
    menu: [
      'shr-border-shorthand shr-flex shr-flex-col shr-rounded-m shr-bg-white shr-py-0.25 shr-shadow-layer-3',
    ],
    menuItem: [
      'shr-cursor-pointer shr-whitespace-nowrap shr-border-none shr-bg-transparent shr-px-0.75 shr-py-0.5 shr-text-left shr-text-sm shr-text-black',
      'hover:shr-bg-white-darken',
      'focus-visible:shr-focus-indicator',
    ],
  },
})

type Props = {
  tabIndex?: number
  onKeyDown?: (e: KeyboardEvent) => void
  onFocus?: () => void
  ref?: (el: HTMLButtonElement | null) => void
}

export const ImageInsertButton: FC<Props> = memo(
  ({ tabIndex = -1, onKeyDown, onFocus, ref: refProp }) => {
    const { editor, onImageUpload, acceptedMimeTypes } = useRichTextEditorContext()
    const { localize } = useIntl()
    const { setIsOpen: setIsMenuOpen, triggerRef, renderDropdown } = useToolbarDropdown()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)
    const [pendingFile, setPendingFile] = useState<File | null>(null)
    const [showUrlDialog, setShowUrlDialog] = useState(false)

    const mimeTypes = acceptedMimeTypes ?? DEFAULT_MIME_TYPES
    const classNames = classNameGenerator()

    const handleClick = useCallback(() => {
      setIsMenuOpen((prev) => !prev)
    }, [setIsMenuOpen])

    const handleUploadClick = useCallback(() => {
      setIsMenuOpen(false)
      fileInputRef.current?.click()
    }, [setIsMenuOpen])

    const handleUrlClick = useCallback(() => {
      setIsMenuOpen(false)
      setShowUrlDialog(true)
    }, [setIsMenuOpen])

    const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        setPendingFile(file)
      }
      if (e.target) {
        e.target.value = ''
      }
    }, [])

    const handleUploadSuccess = useCallback(
      (result: ImageUploadResult, alt: string) => {
        editor
          .chain()
          .focus()
          .insertContent({
            type: 'image',
            attrs: { src: result.src, alt: alt || result.alt || '' },
          })
          .run()
        setPendingFile(null)
      },
      [editor],
    )

    const handleAltCancel = useCallback(() => {
      setPendingFile(null)
    }, [])

    const handleUrlSubmit = useCallback(
      (src: string, alt: string) => {
        editor
          .chain()
          .focus()
          .insertContent({
            type: 'image',
            attrs: { src, alt },
          })
          .run()
        setShowUrlDialog(false)
      },
      [editor],
    )

    const handleUrlCancel = useCallback(() => {
      setShowUrlDialog(false)
    }, [])

    const handleMenuKeyDown = useCallback(
      (e: KeyboardEvent) => {
        const buttons = menuRef.current?.querySelectorAll<HTMLButtonElement>('button')
        if (!buttons) return
        const idx = Array.from(buttons).indexOf(e.currentTarget as HTMLButtonElement)

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault()
            e.stopPropagation()
            buttons[(idx + 1) % buttons.length]?.focus()
            break
          case 'ArrowUp':
            e.preventDefault()
            e.stopPropagation()
            buttons[(idx - 1 + buttons.length) % buttons.length]?.focus()
            break
          case 'Escape':
            e.preventDefault()
            e.stopPropagation()
            setIsMenuOpen(false)
            triggerRef.current?.focus()
            break
          case 'Tab':
            setIsMenuOpen(false)
            break
        }
      },
      [setIsMenuOpen, triggerRef],
    )

    const label = localize({ id: 'smarthr-ui/RichTextEditor/image', defaultText: '画像を挿入' })
    const uploadLabel = localize({
      id: 'smarthr-ui/RichTextEditor/imageFromFile',
      defaultText: 'ファイルをアップロード',
    })
    const urlLabel = localize({
      id: 'smarthr-ui/RichTextEditor/imageFromUrl',
      defaultText: 'URLから挿入',
    })

    return (
      <>
        <ToolbarButton
          ref={(el) => {
            triggerRef.current = el
            refProp?.(el)
          }}
          icon={<FaImageIcon />}
          label={label}
          tabIndex={tabIndex}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              e.stopPropagation()
              setIsMenuOpen(true)
              requestAnimationFrame(() => {
                menuRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
              })
              return
            }
            onKeyDown?.(e)
          }}
          onFocus={onFocus}
          onClick={handleClick}
        />
        {renderDropdown(
          <div ref={menuRef} role="menu" aria-label={label} className={classNames.menu()}>
            {onImageUpload && (
              <button
                type="button"
                role="menuitem"
                className={classNames.menuItem()}
                onClick={handleUploadClick}
                onKeyDown={handleMenuKeyDown}
              >
                {uploadLabel}
              </button>
            )}
            <button
              type="button"
              role="menuitem"
              className={classNames.menuItem()}
              onClick={handleUrlClick}
              onKeyDown={handleMenuKeyDown}
            >
              {urlLabel}
            </button>
          </div>,
        )}
        {/* eslint-disable-next-line smarthr/a11y-input-in-form-control */}
        <input
          ref={fileInputRef}
          type="file"
          name="imageFile"
          accept={mimeTypes.join(',')}
          className="shr-hidden"
          aria-hidden="true"
          tabIndex={-1}
          onChange={handleFileChange}
        />
        {pendingFile && onImageUpload && (
          <AltTextDialog
            file={pendingFile}
            onImageUpload={onImageUpload}
            onSuccess={handleUploadSuccess}
            onCancel={handleAltCancel}
          />
        )}
        {showUrlDialog && <ImageUrlDialog onInsert={handleUrlSubmit} onClose={handleUrlCancel} />}
      </>
    )
  },
)
