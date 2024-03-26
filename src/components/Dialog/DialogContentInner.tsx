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
import { useTheme } from '../../hooks/useTailwindTheme'

import { BodyScrollSuppressor } from './BodyScrollSuppressor'
import { DialogOverlap } from './DialogOverlap'
import { DialogPositionProvider } from './DialogPositionProvider'
import { FocusTrap } from './FocusTrap'

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
   * ダイアログを開いたときの初期 top 位置
   */
  top?: number
  /**
   * ダイアログを開いたときの初期 right 位置
   */
  right?: number
  /**
   * ダイアログを開いたときの初期 bottom 位置
   */
  bottom?: number
  /**
   * ダイアログを開いたときの初期 left 位置
   */
  left?: number
  /**
   * ダイアログの `id`
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

function exist(value: any) {
  return value !== undefined && value !== null
}

const dialogContentInner = tv({
  slots: {
    layout: 'smarthr-ui-Dialog-wrapper shr-fixed shr-inset-0',
    inner:
      'smarthr-ui-Dialog contrast-more:shr-border-highContrast shr-absolute shr-rounded-m shr-bg-white shr-shadow-layer-3 contrast-more:shr-border-shorthand',
    background: 'smarthr-ui-Dialog-background shr-fixed shr-inset-0 shr-bg-scrim',
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
  top,
  right,
  bottom,
  left,
  firstFocusTarget,
  ariaLabel,
  ariaLabelledby,
  children,
  className,
  ...props
}) => {
  const { spacing } = useTheme()
  const { layoutStyle, innerStyleProps, backgroundStyle } = useMemo(() => {
    const { layout, inner, background } = dialogContentInner()
    const positionTop = exist(top) ? `${top}px` : 'auto'
    const positionRight = exist(right) ? `${right}px` : 'auto'
    const positionBottom = exist(bottom) ? `${bottom}px` : 'auto'
    const positionLeft = exist(left) ? `${left}px` : 'auto'
    const actualWidth = typeof width === 'number' ? `${width}px` : width
    const minimumMaxWidth = `calc(100vw - max(${left || 0}px, ${spacing[0.5]}) - max(${
      right || 0
    }px, ${spacing[0.5]}))`
    const translateX = exist(right) || exist(left) ? '0' : 'calc((100vw - 100%) / 2)'
    const translateY = exist(top) || exist(bottom) ? '0' : 'calc((100svh - 100%) / 2)'
    return {
      layoutStyle: layout(),
      innerStyleProps: {
        className: inner({ className }),
        style: {
          inset: `${positionTop} ${positionRight} ${positionBottom} ${positionLeft}`,
          width: exist(actualWidth) ? actualWidth : undefined,
          maxWidth: exist(actualWidth)
            ? `min(${minimumMaxWidth}, ${actualWidth})`
            : minimumMaxWidth,
          transform: `translate(${translateX}, ${translateY})`,
        },
      },
      backgroundStyle: background(),
    }
  }, [bottom, className, left, right, spacing, top, width])

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
    if (!isOpen) {
      return
    }
    onClickOverlay && onClickOverlay()
  }, [isOpen, onClickOverlay])

  return (
    <DialogPositionProvider top={top} bottom={bottom}>
      <DialogOverlap isOpen={isOpen}>
        <div className={layoutStyle} id={id}>
          {/* eslint-disable-next-line smarthr/a11y-delegate-element-has-role-presentation */}
          <div onClick={handleClickOverlay} className={backgroundStyle} role="presentation" />
          <div
            {...props}
            {...innerStyleProps}
            ref={innerRef}
            role="dialog"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            aria-modal="true"
          >
            <FocusTrap firstFocusTarget={firstFocusTarget}>{children}</FocusTrap>
          </div>
          {/* Suppresses scrolling of body while modal is displayed */}
          <BodyScrollSuppressor />
        </div>
      </DialogOverlap>
    </DialogPositionProvider>
  )
}
