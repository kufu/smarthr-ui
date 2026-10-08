'use client'

import {
  type ChangeEvent,
  type FC,
  type KeyboardEvent,
  memo,
  useMemo,
  useRef,
  useState,
} from 'react'
import { FaImageIcon } from 'smarthr-ui'

import { useMergeRefs } from '../../../hooks/client/useMergeRefs'
import { useLatest } from '../../../hooks/useLatest'
import { useIntl } from '../../../intl'
import { tv } from '../../../libs/tv'
import { useRichTextEditorContext } from '../context/RichTextEditorContext'
import { DEFAULT_MIME_TYPES, matchesMimeType } from '../extensions/Image/mimeTypes'
import { uploadAndInsertImage } from '../extensions/Image/uploadAndInsertImage'
import { useToolbarDropdown } from '../hooks/useToolbarDropdown'

import { ImageUrlPopover } from './ImageUrlPopover'
import { ToolbarButton } from './ToolbarButton'

const classNameGenerator = tv({
  slots: {
    menu: [
      'shr-rte-border-shorthand shr-rte-flex shr-rte-flex-col shr-rte-rounded-m shr-rte-bg-white shr-rte-py-0.25 shr-rte-shadow-layer-3',
    ],
    menuItem: [
      'shr-rte-cursor-pointer shr-rte-whitespace-nowrap shr-rte-border-none shr-rte-bg-transparent shr-rte-px-0.75 shr-rte-py-0.5 shr-rte-text-left shr-rte-text-sm shr-rte-text-black',
      'hover:shr-rte-bg-white-darken',
      'focus-visible:shr-rte-focus-indicator',
    ],
  },
})

const CLASS_NAMES = (() => {
  const { menu, menuItem } = classNameGenerator()

  return {
    menu: menu(),
    menuItem: menuItem(),
  }
})()

type Props = {
  tabIndex?: number
  disabled?: boolean
  onKeyDown?: (e: KeyboardEvent) => void
  onFocus?: () => void
  ref?: (el: HTMLButtonElement | null) => void
}

export const ImageInsertButton: FC<Props> = memo(
  ({ tabIndex = -1, disabled, onKeyDown, onFocus, ref: refProp }) => {
    const { editor, hasImageUpload, getImageUploadHandlers, acceptedMimeTypes } =
      useRichTextEditorContext()
    const { localize } = useIntl()
    const [view, setView] = useState<'menu' | 'url'>('menu')
    const { isOpen, setIsOpen, triggerRef, renderDropdown } = useToolbarDropdown(view)
    const mergedTriggerRef = useMergeRefs(triggerRef, refProp)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)

    const mimeTypes = acceptedMimeTypes ?? DEFAULT_MIME_TYPES

    const latest = useLatest({ mimeTypes, isOpen, view, triggerRef, onKeyDown })

    const functions = useMemo(() => {
      const focusTrigger = () => {
        const trigger = latest.triggerRef.current

        // 外れた/無効なトリガーへ戻すとフォーカスが body へ落ちる
        if (trigger?.isConnected && !trigger.matches(':disabled')) trigger.focus()
      }
      const openMenu = (focusFirstItem: boolean) => {
        setView('menu')
        setIsOpen(true)

        if (focusFirstItem) {
          requestAnimationFrame(() => {
            menuRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
          })
        }
      }

      return {
        handleClick: () => {
          if (latest.isOpen) setIsOpen(false)
          else openMenu(false)
        },
        handleTriggerKeyDown: (e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            e.stopPropagation()

            if (latest.isOpen && latest.view === 'url') setIsOpen(false)
            else openMenu(true)

            return
          }

          latest.onKeyDown?.(e)
        },
        handleUploadClick: () => {
          setIsOpen(false)
          fileInputRef.current?.click()
        },
        handleUrlClick: () => {
          setView('url')
        },
        handleFileChange: (e: ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0]
          const { onImageUpload, onImageUploadError } = getImageUploadHandlers()
          // accept 属性はダイアログの絞り込みヒントでしかなく利用者が回避できるため、
          // D&D・貼り付けと同じく選ばれたファイルの MIME type を確認する
          if (file && onImageUpload && matchesMimeType(file.type, latest.mimeTypes)) {
            uploadAndInsertImage(editor, file, null, onImageUpload, onImageUploadError)
          }
          if (e.target) {
            e.target.value = ''
          }
        },
        handleUrlInsert: (src: string) => {
          editor
            .chain()
            .focus()
            .insertContent({ type: 'image', attrs: { src, alt: '' } })
            .run()
          setIsOpen(false)
        },
        handleUrlCancel: () => {
          setIsOpen(false)
          focusTrigger()
        },
        handleMenuKeyDown: (e: KeyboardEvent) => {
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
            // ポータルは body 末尾にあり Tab の既定の移動先が無いため、Escape と同じくトリガーへ戻す
            case 'Escape':
            case 'Tab':
              e.preventDefault()
              e.stopPropagation()
              setIsOpen(false)
              focusTrigger()
              break
          }
        },
      }
    }, [editor, getImageUploadHandlers, setIsOpen, latest])

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
          ref={mergedTriggerRef}
          disabled={disabled}
          tabIndex={tabIndex}
          aria-expanded={isOpen}
          aria-haspopup={isOpen && view === 'url' ? 'dialog' : 'menu'}
          onKeyDown={functions.handleTriggerKeyDown}
          onFocus={onFocus}
          onClick={functions.handleClick}
          icon={<FaImageIcon />}
          label={label}
        />
        {renderDropdown(
          view === 'url' ? (
            <ImageUrlPopover
              handleInsert={functions.handleUrlInsert}
              handleCancel={functions.handleUrlCancel}
            />
          ) : (
            <div ref={menuRef} role="menu" className={CLASS_NAMES.menu} aria-label={label}>
              {hasImageUpload && (
                <button
                  role="menuitem"
                  type="button"
                  className={CLASS_NAMES.menuItem}
                  onClick={functions.handleUploadClick}
                  onKeyDown={functions.handleMenuKeyDown}
                >
                  {uploadLabel}
                </button>
              )}
              <button
                role="menuitem"
                type="button"
                className={CLASS_NAMES.menuItem}
                onClick={functions.handleUrlClick}
                onKeyDown={functions.handleMenuKeyDown}
              >
                {urlLabel}
              </button>
            </div>
          ),
        )}
        {/* eslint-disable-next-line smarthr/a11y-input-in-form-control */}
        <input
          ref={fileInputRef}
          type="file"
          name="imageFile"
          accept={mimeTypes.join(',')}
          tabIndex={-1}
          className="shr-rte-hidden"
          aria-hidden="true"
          onChange={functions.handleFileChange}
        />
      </>
    )
  },
)
