'use client'

import {
  type ComponentPropsWithRef,
  type FC,
  type RefObject,
  memo,
  useLayoutEffect,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { useEscapeCallbackRef } from '../../../hooks/client/useEscapeCallbackRef'
import { useLatest } from '../../../hooks/useLatest'
import { dialogSize } from '../../../tailwind'

import { DialogOverlapCenter } from './DialogOverlapCenter'
import { FocusTrap } from './FocusTrap'

import type { ExtendElementPropsWithRef } from '../../../types'
import type { DialogSize } from '../types'

type FocusTrapProps = ComponentPropsWithRef<typeof FocusTrap>

type Props = ExtendElementPropsWithRef<
  'div',
  {
    /**
     * オーバーレイをクリックした時に発火するコールバック関数
     * @todo イベントハンドラー命名規則に従い handleClickOverlay に変更すべき（影響範囲大のため別PR）
     */
    onClickOverlay?: () => void
    /**
     * エスケープキーを押下した時に発火するコールバック関数
     * @todo イベントハンドラー命名規則に従い handlePressEscape に変更すべき（影響範囲大のため別PR）
     */
    onPressEscape?: (e: KeyboardEvent) => void
    /**
     * ダイアログを開いているかどうか
     */
    isOpen: boolean
    /**
     * ダイアログの大きさ
     */
    size?: DialogSize
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
    focusTrapRef?: FocusTrapProps['ref']
  }
>

const DIALOG_CONTENT_CLASS_NAME = 'smarthr-ui-Dialog'

const classNameGenerator = tv({
  slots: {
    // HINT: safe areaを除いた領域の中央にダイアログを配置する。
    // 背景(background)はDialogOverlapを基準にinset-0で配置しているため、paddingに関わらず画面全体を覆う
    overlap: [
      'shr-pr-[env(safe-area-inset-right)] shr-pt-[env(safe-area-inset-top)]',
      'shr-pb-[env(safe-area-inset-bottom)] shr-pl-[env(safe-area-inset-left)]',
    ],
    layout: [
      'smarthr-ui-Dialog-wrapper',
      'shr-max-w-[calc(100dvw-theme(spacing.1)-env(safe-area-inset-left)-env(safe-area-inset-right))]',
    ],
    inner: [
      DIALOG_CONTENT_CLASS_NAME,
      'shr-border-shorthand shr-relative shr-z-1 shr-rounded-m shr-bg-white shr-shadow-layer-3',
      'shr-max-h-[calc(100dvh-theme(spacing.2))] shr-overflow-y-auto',
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

export const DialogContent: FC<Props> = ({
  onClickOverlay,
  onPressEscape,
  isOpen,
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
    const { overlap, layout, inner, background } = classNameGenerator()

    return {
      overlap: overlap(),
      layout: layout({ size }),
      inner: inner({ className }),
      background: background(),
    }
  }, [size, className])

  const latest = useLatest({ isOpen, onPressEscape, onClickOverlay })

  const functions = useMemo(
    () => ({
      handlePressEscape: (e: KeyboardEvent) => {
        if (latest.isOpen) {
          latest.onPressEscape?.(e)
        }
      },
      handleClickOverlay: () => {
        if (latest.isOpen) {
          latest.onClickOverlay?.()
        }
      },
    }),
    [latest],
  )

  const callbackRef = useEscapeCallbackRef(functions.handlePressEscape)

  useLayoutEffect(() => {
    if (!isOpen) return

    const body = document.body
    const scrollBarWidth = window.innerWidth - body.clientWidth
    const originalPaddingRight = getComputedStyle(body).getPropertyValue('padding-right')

    const bodyStyle = body.style

    bodyStyle.paddingInlineEnd = `${scrollBarWidth + parseInt(originalPaddingRight, 10)}px`
    bodyStyle.overflow = 'hidden'

    return () => {
      bodyStyle.paddingInlineEnd = ''
      bodyStyle.overflow = ''
    }
  }, [isOpen])

  return (
    <DialogOverlapCenter isOpen={isOpen} className={classNames.overlap}>
      <div ref={callbackRef} className={classNames.layout}>
        <Overlay
          className={classNames.background}
          handleClickOverlay={isOpen ? functions.handleClickOverlay : undefined}
        />
        <div
          {...rest}
          role="dialog"
          className={classNames.inner}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-modal="true"
        >
          <FocusTrap ref={focusTrapRef} firstFocusTarget={firstFocusTarget}>
            {children}
          </FocusTrap>
        </div>
      </div>
    </DialogOverlapCenter>
  )
}

const Overlay = memo<{ handleClickOverlay: (() => void) | undefined; className: string }>(
  ({ handleClickOverlay, className }) => (
    // eslint-disable-next-line smarthr/best-practice-for-interactive-element
    <div role="presentation" className={className} onClick={handleClickOverlay} />
  ),
)
