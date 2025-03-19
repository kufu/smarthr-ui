'use client'

import {
  type ComponentProps,
  type FC,
  type PropsWithChildren,
  type RefObject,
  memo,
  useMemo,
  useRef,
} from 'react'
import { tv } from 'tailwind-variants'

import { useHandleEscape } from '../../hooks/useHandleEscape'

import { DialogOverlap } from './DialogOverlap'
import { FocusTrap, type FocusTrapRef } from './FocusTrap'
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
  /**
   * ダイアログトップのフォーカストラップへの ref
   */
  focusTrapRef?: RefObject<FocusTrapRef>
}>
type ElementProps = Omit<ComponentProps<'div'>, keyof DialogContentInnerProps>

const classNameGenerator = tv({
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
  onPressEscape,
  isOpen,
  id,
  width,
  firstFocusTarget,
  ariaLabel,
  ariaLabelledby,
  children,
  className,
  focusTrapRef,
  ...rest
}) => {
  const classNames = useMemo(() => {
    const { layout, inner, background } = classNameGenerator()

    return {
      layout: layout(),
      inner: inner({ className }),
      background: background(),
    }
  }, [className])
  const style = useMemo(() => {
    const actualWidth = typeof width === 'number' ? `${width}px` : width

    return actualWidth ? { width: actualWidth } : undefined
  }, [width])

  const innerRef = useRef<HTMLDivElement>(null)

  useHandleEscape(
    useMemo(() => (onPressEscape && isOpen ? onPressEscape : undefined), [isOpen, onPressEscape]),
  )

  useBodyScrollLock(isOpen)

  return (
    <DialogOverlap isOpen={isOpen}>
      <div id={id} className={classNames.layout} style={style}>
        <Overlay
          isOpen={isOpen}
          onClickOverlay={onClickOverlay}
          className={classNames.background}
        />
        <div
          {...rest}
          ref={innerRef}
          role="dialog"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-modal="true"
          className={classNames.inner}
        >
          <FocusTrap firstFocusTarget={firstFocusTarget} ref={focusTrapRef}>
            {children}
          </FocusTrap>
        </div>
      </div>
    </DialogOverlap>
  )
}

const Overlay = memo<
  Pick<DialogContentInnerProps, 'onClickOverlay' | 'isOpen'> & { className: string }
>(({ onClickOverlay, isOpen, className }) => {
  const handleClickOverlay = useMemo(
    () => (onClickOverlay && isOpen ? onClickOverlay : undefined),
    [isOpen, onClickOverlay],
  )

  // eslint-disable-next-line smarthr/a11y-delegate-element-has-role-presentation
  return <div onClick={handleClickOverlay} className={className} role="presentation" />
})
