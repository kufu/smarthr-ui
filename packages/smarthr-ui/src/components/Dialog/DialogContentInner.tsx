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
import { dialogSize } from '../../themes/tailwind'

import { DialogOverlap } from './DialogOverlap'
import { FocusTrap, type FocusTrapRef } from './FocusTrap'
import { useBodyScrollLock } from './useBodyScrollLock'

import type { DialogSize } from './types'

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
   * @deprecated ダイアログの幅を指定する場合は、`width` ではなく `size` を使用してください。
   * ダイアログの幅
   */
  width?: string | number
  /**
   * ダイアログの大きさ
   */
  size?: DialogSize
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
type Props = DialogContentInnerProps & Omit<ComponentProps<'div'>, keyof DialogContentInnerProps>

const classNameGenerator = tv({
  slots: {
    layout: ['smarthr-ui-Dialog-wrapper', 'shr-max-w-[calc(100dvw-theme(spacing.1))]'],
    inner: [
      'smarthr-ui-Dialog',
      'shr-border-shorthand shr-relative shr-z-1 shr-rounded-m shr-bg-white shr-shadow-layer-3',
      'contrast-more:shr-border-high-contrast',
    ],
    background: ['smarthr-ui-Dialog-background', 'shr-absolute shr-inset-0 shr-bg-scrim'],
  },
  variants: {
    size: {
      XS: { layout: dialogSize.XS },
      S: { layout: dialogSize.S },
      M: { layout: dialogSize.M },
      L: { layout: dialogSize.L },
      XL: { layout: dialogSize.XL },
      XXL: { layout: dialogSize.XXL },
      FULL: { layout: dialogSize.FULL },
    },
  },
})

export const DialogContentInner: FC<Props> = ({
  onClickOverlay,
  onPressEscape,
  isOpen,
  id,
  width,
  size,
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
      layout: layout({ size }),
      inner: inner({ className }),
      background: background(),
    }
  }, [size, className])
  const style = useMemo(() => {
    // width は deprecated なので、size が指定されている場合は width を無視する
    const actualWidth = size ? undefined : typeof width === 'number' ? `${width}px` : width

    return actualWidth ? { width: actualWidth } : undefined
  }, [width, size])

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

const Overlay = memo<Pick<Props, 'onClickOverlay' | 'isOpen'> & { className: string }>(
  ({ onClickOverlay, isOpen, className }) => {
    const onClick = useMemo(
      () => (onClickOverlay && isOpen ? onClickOverlay : undefined),
      [isOpen, onClickOverlay],
    )

    // eslint-disable-next-line smarthr/best-practice-for-interactive-element
    return <div onClick={onClick} className={className} role="presentation" />
  },
)
