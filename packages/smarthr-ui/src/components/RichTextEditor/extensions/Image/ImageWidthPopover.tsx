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
import { FaLockIcon, FaUpRightAndDownLeftFromCenterIcon } from '../../../Icon'
import { Input } from '../../../Input'
import { Cluster, Stack } from '../../../Layout'
import { useToolbarDropdown } from '../../hooks/useToolbarDropdown'

import { calcHeightFromWidth, calcWidthFromHeight } from './aspectRatio'

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
    row: 'shr-flex shr-items-end shr-gap-0.5',
    lock: 'shr-shrink-0 shr-self-center shr-text-grey',
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

const resolveImageEl = (editor: Editor, pos: number): HTMLImageElement | null => {
  const dom = editor.view.nodeDOM(pos) as HTMLElement | null

  return (dom?.tagName === 'IMG' ? dom : dom?.querySelector('img')) as HTMLImageElement | null
}

const getNaturalSize = (editor: Editor, pos: number): { w: number; h: number } => {
  const img = resolveImageEl(editor, pos)

  return { w: img?.naturalWidth ?? 0, h: img?.naturalHeight ?? 0 }
}

// 画面に表示されている実寸（max-width:100% による縮小後のサイズ）
const getRenderedSize = (editor: Editor, pos: number): { w: number; h: number } => {
  const img = resolveImageEl(editor, pos)

  return { w: img?.offsetWidth ?? 0, h: img?.offsetHeight ?? 0 }
}

export const ImageWidthPopover: FC<Props> = memo(
  ({ editor, pos, tabIndex = -1, onKeyDown, onFocus, ref: refProp }) => {
    const { localize } = useIntl()
    const { isOpen, setIsOpen, triggerRef, renderDropdown } = useToolbarDropdown()
    const classNames = classNameGenerator()
    const [width, setWidth] = useState('')
    const [height, setHeight] = useState('')
    const naturalRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 })
    const widthInputRef = useRef<HTMLInputElement>(null)

    const label = localize({ id: 'smarthr-ui/RichTextEditor/imageWidth', defaultText: 'サイズ' })
    const widthLabel = localize({
      id: 'smarthr-ui/RichTextEditor/imageWidthLabel',
      defaultText: '幅 (px)',
    })
    const heightLabel = localize({
      id: 'smarthr-ui/RichTextEditor/imageHeightLabel',
      defaultText: '高さ (px)',
    })
    const resetLabel = localize({
      id: 'smarthr-ui/RichTextEditor/imageSizeReset',
      defaultText: 'リセット',
    })
    const applyLabel = localize({
      id: 'smarthr-ui/RichTextEditor/imageInsertButton',
      defaultText: '挿入',
    })
    const lockLabel = localize({
      id: 'smarthr-ui/RichTextEditor/imageAspectLocked',
      defaultText: '縦横比を固定',
    })

    useEffect(() => {
      if (!isOpen) return

      const node = editor.state.doc.nodeAt(pos)

      naturalRef.current = getNaturalSize(editor, pos)
      // width/height 属性が未設定なら、現在の表示サイズを初期値として入れる
      const rendered = getRenderedSize(editor, pos)
      setWidth(node?.attrs.width ? String(node.attrs.width) : rendered.w ? String(rendered.w) : '')
      setHeight(
        node?.attrs.height ? String(node.attrs.height) : rendered.h ? String(rendered.h) : '',
      )
      requestAnimationFrame(() => widthInputRef.current?.focus())
    }, [isOpen, editor, pos])

    const handleWidthChange = useCallback((value: string) => {
      setWidth(value)

      const h = calcHeightFromWidth(Number(value), naturalRef.current.w, naturalRef.current.h)

      if (h !== undefined) setHeight(String(h))
    }, [])

    const handleHeightChange = useCallback((value: string) => {
      setHeight(value)

      const w = calcWidthFromHeight(Number(value), naturalRef.current.w, naturalRef.current.h)

      if (w !== undefined) setWidth(String(w))
    }, [])

    const apply = useCallback(
      (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const w = Number(width)
        const h = Number(height)

        editor
          .chain()
          .setNodeSelection(pos)
          .updateAttributes('image', {
            width: Number.isFinite(w) && w > 0 ? w : null,
            height: Number.isFinite(h) && h > 0 ? h : null,
          })
          .run()
        setIsOpen(false)
      },
      [editor, pos, width, height, setIsOpen],
    )

    const reset = useCallback(() => {
      editor
        .chain()
        .setNodeSelection(pos)
        .updateAttributes('image', { width: null, height: null })
        .run()
      setIsOpen(false)
    }, [editor, pos, setIsOpen])

    const closePopup = useCallback(() => {
      setIsOpen(false)
      triggerRef.current?.focus()
    }, [setIsOpen, triggerRef])

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
          <FaUpRightAndDownLeftFromCenterIcon alt="" />
          {label}
        </button>
        {renderDropdown(
          <div role="dialog" aria-label={label} className={classNames.menu()}>
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
            <form noValidate onSubmit={apply} onKeyDown={handlePopupKeyDown}>
              <Stack gap={0.75}>
                <div className={classNames.row()}>
                  <FormControl label={widthLabel}>
                    <Input
                      ref={widthInputRef}
                      type="number"
                      name="imageWidth"
                      value={width}
                      width="6em"
                      onChange={(e) => handleWidthChange(e.target.value)}
                    />
                  </FormControl>
                  <FaLockIcon className={classNames.lock()} alt={lockLabel} />
                  <FormControl label={heightLabel}>
                    <Input
                      type="number"
                      name="imageHeight"
                      value={height}
                      width="6em"
                      onChange={(e) => handleHeightChange(e.target.value)}
                    />
                  </FormControl>
                </div>
                <Cluster gap={0.5} justify="space-between">
                  <Button type="button" size="S" variant="secondary" onClick={reset}>
                    {resetLabel}
                  </Button>
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
