'use client'

import React, {
  ComponentProps,
  FC,
  PropsWithChildren,
  RefObject,
  useCallback,
  useMemo,
  useRef,
} from 'react'
import { tv } from 'tailwind-variants'

import { useHandleEscape } from '../../hooks/useHandleEscape'

import { DialogOverlap } from './DialogOverlap'
import { FocusTrap } from './FocusTrap'
import { useBodyScrollLock } from './useBodyScrollLock'

export type DialogContentInnerProps = PropsWithChildren<{
  /**
   * オーバーレイをクリックした時に発火するコールバック関数
   */
  onClickOverlay?: () => void
  /**
   * エスケープキーを押下した時に発火するコールバック関数
   */
  onPressEscape?: () => void
  /**
   * ダイアログを開いているかどうか
   */
  isOpen: boolean
  /**
   * ダイアログの幅
   */
  width?: string | number
  /**
   * ダイアログの `id`
   * TODO 使われてなさそうなので確認
   */
  id?: string
  /**
   * ダイアログを開いた時にフォーカスする対象
   */
  firstFocusTarget?: RefObject<HTMLElement>
  /**
   * ダイアログの `aria-label`
   */
  ariaLabel?: string
  /**
   * ダイアログの `aria-labelledby`
   */
  ariaLabelledby?: string
}>
type ElementProps = Omit<ComponentProps<'div'>, keyof DialogContentInnerProps>

const dialogContentInner = tv({
  slots: {
    layout: ['smarthr-ui-Dialog-wrapper', 'shr-max-w-[calc(100dvw-theme(spacing.1))]'],
    inner: [
      'smarthr-ui-Dialog',
      'shr-relative shr-z-1 shr-rounded-m shr-bg-white shr-shadow-layer-3',
      'contrast-more:shr-border-highContrast contrast-more:shr-border-shorthand',
    ],
    background: ['smarthr-ui-Dialog-background', 'shr-absolute shr-inset-0 shr-bg-scrim'],
  },
})

export const DialogContentInner: FC<DialogContentInnerProps & ElementProps> = ({
  onClickOverlay,
  onPressEscape = () => {
    /* noop */
  },
  isOpen,
  id,
  width,
  firstFocusTarget,
  ariaLabel,
  ariaLabelledby,
  children,
  className,
  ...rest
}) => {
  const { layoutStyleProps, innerStyle, backgroundStyle } = useMemo(() => {
    const { layout, inner, background } = dialogContentInner()
    const actualWidth = typeof width === 'number' ? `${width}px` : width
    return {
      layoutStyleProps: {
        className: layout(),
        style: {
          width: actualWidth ?? undefined,
        },
      },
      innerStyle: inner({ className }),
      backgroundStyle: background(),
    }
  }, [className, width])

  const innerRef = useRef<HTMLDivElement>(null)
  useHandleEscape(
    useCallback(() => {
      if (!isOpen) {
        return
      }
      onPressEscape()
    }, [isOpen, onPressEscape]),
  )

  const handleClickOverlay = useCallback(() => {
    if (isOpen && onClickOverlay) {
      onClickOverlay()
    }
  }, [isOpen, onClickOverlay])

  useBodyScrollLock(isOpen)

  return (
    <DialogOverlap isOpen={isOpen}>
      <div {...layoutStyleProps} id={id}>
        {/* eslint-disable-next-line smarthr/a11y-delegate-element-has-role-presentation */}
        <div onClick={handleClickOverlay} className={backgroundStyle} role="presentation" />
        <div
          {...rest}
          ref={innerRef}
          role="dialog"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-modal="true"
          className={innerStyle}
        >
          <FocusTrap firstFocusTarget={firstFocusTarget}>{children}</FocusTrap>
        </div>
      </div>
    </DialogOverlap>
  )
}
