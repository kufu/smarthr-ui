'use client'

import {
  type CSSProperties,
  type FC,
  type RefObject,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { useEscapeCallbackRef } from '../../hooks/client/useEscapeCallbackRef'
import { useLatest } from '../../hooks/useLatest'
import { FocusTrap, type FocusTrapRef, useBodyScrollLock } from '../Dialog'

import { DrawerContentContext } from './DrawerContentContext'
import { DrawerHeadingContext } from './DrawerHeadingContext'
import { drawerSize } from './drawerSize'
import { useDrawerDrag } from './useDrawerDrag'

import type {
  DirectChildren,
  DrawerCommonProps,
  DrawerControlledProps,
  DrawerPosition,
} from './types'

export type DrawerContentInnerProps = DrawerCommonProps &
  DrawerControlledProps &
  DirectChildren & {
    id?: string
    className?: string
    focusTrapRef?: RefObject<FocusTrapRef>
    /** Portal 先が指定されているか（modeless の absolute/fixed 切替に使う） */
    hasPortalParent?: boolean
  }

const TRANSITION_DURATION = 400

// スライド／フェードは RTG の遷移状態（entering/entered/exiting）を見て inline style で当てる。
// （Tailwind の子孫セレクタ方式は確実に効かなかったため、transform/opacity は JS 側で制御する）
const EASING = 'cubic-bezier(0.32, 0.72, 0, 1)'
const TRANSITION_TRANSFORM = `transform ${TRANSITION_DURATION}ms ${EASING}`
const TRANSITION_OPACITY = `opacity ${TRANSITION_DURATION}ms ${EASING}`

const classNameGenerator = tv({
  slots: {
    layout: ['smarthr-ui-Drawer-layout', 'shr-inset-0 shr-z-overlap-base'],
    overlay: ['smarthr-ui-Drawer-overlay', 'shr-absolute shr-inset-0 shr-bg-scrim'],
    inner: [
      'smarthr-ui-Drawer',
      'shr-border-shorthand shr-pointer-events-auto shr-absolute shr-flex shr-flex-col shr-bg-white shr-shadow-layer-3',
      'contrast-more:shr-border-high-contrast',
    ],
    // 上辺中央の横バー（grabber）。ポインタ操作専用の装飾
    handleArea: [
      'smarthr-ui-Drawer-handle',
      'shr-flex shr-min-h-[1.75rem] shr-w-full shr-shrink-0 shr-cursor-row-resize shr-touch-none shr-items-center shr-justify-center',
    ],
    handleBar: ['shr-h-0.25 shr-w-[2.5rem] shr-rounded-full shr-bg-border'],
  },
  variants: {
    position: {
      right: { inner: 'shr-inset-y-0 shr-right-0 shr-h-full' },
      left: { inner: 'shr-inset-y-0 shr-left-0 shr-h-full' },
      bottom: { inner: 'shr-inset-x-0 shr-bottom-0 shr-max-h-full shr-w-full shr-rounded-t-l' },
    },
    size: {
      S: { inner: drawerSize.S },
      M: { inner: drawerSize.M },
      L: { inner: drawerSize.L },
      FULL: { inner: drawerSize.FULL },
    },
    variant: {
      modal: {},
      modeless: { layout: 'shr-pointer-events-none' },
    },
    layoutPosition: {
      fixed: { layout: 'shr-fixed' },
      absolute: { layout: 'shr-absolute' },
    },
  },
})

// 閉じ位置（画面外）への transform 文字列
const closedTransform: Record<DrawerPosition, string> = {
  right: 'translateX(100%)',
  left: 'translateX(-100%)',
  bottom: 'translateY(100%)',
}

// tv の bottom / left/right に入れている calc() の減算値（spacing.1 = 16px）と対にする
const DRAWER_VIEWPORT_GAP = 16

export const DrawerContentInner: FC<DrawerContentInnerProps> = ({
  position = 'right',
  size,
  isOpen,
  onClickClose,
  onClickOverlay,
  onPressEscape,
  ariaLabel,
  ariaLabelledby,
  variant = 'modal',
  // Drawer / DrawerContent からは常に渡される。内部コンポーネント専用のフォールバック既定。
  hasPortalParent = false,
  firstFocusTarget,
  focusTrapRef,
  id,
  className,
  children,
}) => {
  const autoHeadingId = useId()
  const innerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)

  const resolvedLabelledby = useMemo(() => {
    if (ariaLabel) return undefined
    return ariaLabelledby ?? autoHeadingId
  }, [ariaLabel, ariaLabelledby, autoHeadingId])

  // bottom のパネル高は CSS 側で calc(100dvh - spacing.1) に固定している。
  // swipe-to-dismiss の閉じ判定に使う全開サイズをそこから求める。
  const fullSize = useMemo(
    () => (typeof window === 'undefined' ? 0 : window.innerHeight - DRAWER_VIEWPORT_GAP),
    [],
  )

  const drag = useDrawerDrag({
    position,
    fullSize,
    isOpen,
    onClose: onClickClose,
  })

  const classNames = useMemo(() => {
    const { layout, overlay, inner, handleArea, handleBar } = classNameGenerator()
    const appliedSize = position === 'bottom' ? undefined : size
    const layoutPosition = variant === 'modeless' && hasPortalParent ? 'absolute' : 'fixed'
    return {
      layout: layout({ variant, layoutPosition }),
      overlay: overlay(),
      inner: inner({ position, size: appliedSize, variant, className }),
      handleArea: handleArea(),
      handleBar: handleBar(),
    }
  }, [position, size, variant, hasPortalParent, className])

  // 開いた状態での inner の transform。bottom はドラッグ offset を反映、left/right は 0。
  const openedTransform = useMemo(() => {
    if (position !== 'bottom' || drag.translateOffset === 0) return 'translateY(0)'
    return `translateY(${drag.translateOffset}px)`
  }, [position, drag.translateOffset])

  // 自前のマウント＋アニメーション制御（RTG の state 遷移が不安定だったため）。
  // shouldMount: DOM に存在させるか。entered: 開き位置へスライドさせるか（false=閉じ位置）。
  const [shouldMount, setShouldMount] = useState(isOpen)
  const [entered, setEntered] = useState(false)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (isOpen) {
      // 開く: まず閉じ位置でマウントし、次フレームで開き位置へ補間
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current)
        closeTimerRef.current = null
      }
      setShouldMount(true)
      setEntered(false)
      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => setEntered(true))
        rafRef.current = raf2
      })
      rafRef.current = raf1
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
      }
    }

    // 閉じる: 開き位置→閉じ位置へ補間し、アニメ完了後にアンマウント
    setEntered(false)
    closeTimerRef.current = setTimeout(() => setShouldMount(false), TRANSITION_DURATION)
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    }
  }, [isOpen])

  const innerStyle = useMemo<CSSProperties>(() => {
    // ドラッグ中は補間を切って指に追従
    if (drag.isDragging) {
      return { transform: openedTransform, transition: 'none' }
    }
    return {
      transform: entered ? openedTransform : closedTransform[position],
      transition: TRANSITION_TRANSFORM,
    }
  }, [drag.isDragging, openedTransform, entered, position])

  const overlayStyle = useMemo<CSSProperties>(
    () => ({ opacity: entered ? 1 : 0, transition: TRANSITION_OPACITY }),
    [entered],
  )

  const latest = useLatest({ isOpen, onPressEscape })

  const functions = useMemo(
    () => ({
      handlePressEscape: () => {
        if (latest.isOpen) {
          latest.onPressEscape?.()
        }
      },
    }),
    [latest],
  )

  const escapeCallbackRef = useEscapeCallbackRef(functions.handlePressEscape)

  useBodyScrollLock(isOpen && variant === 'modal')

  const onClickCloseSafe = useMemo(() => onClickClose ?? (() => undefined), [onClickClose])

  if (!shouldMount) return null

  const handleElement = (
    <div
      className={classNames.handleArea}
      aria-hidden="true"
      onPointerCancel={drag.onPointerCancel}
      onPointerDown={drag.onPointerDown}
      onPointerMove={drag.onPointerMove}
      onPointerUp={drag.onPointerUp}
    >
      <span className={classNames.handleBar} />
    </div>
  )
  const drawerBody = (
    <DrawerContentContext.Provider value={{ onClickClose: onClickCloseSafe }}>
      <DrawerHeadingContext.Provider value={{ headingId: autoHeadingId }}>
        {position === 'bottom' && handleElement}
        {children}
      </DrawerHeadingContext.Provider>
    </DrawerContentContext.Provider>
  )
  return (
    <div ref={escapeCallbackRef} id={id} className={classNames.layout}>
      {variant === 'modal' && (
        /* eslint-disable-next-line smarthr/best-practice-for-interactive-element */
        <div
          role="presentation"
          className={classNames.overlay}
          style={overlayStyle}
          onClick={onClickOverlay}
        />
      )}
      <div
        ref={innerRef}
        role="dialog"
        className={classNames.inner}
        style={innerStyle}
        aria-modal={variant === 'modal' || undefined}
        aria-label={ariaLabel}
        aria-labelledby={resolvedLabelledby}
      >
        {variant === 'modal' ? (
          <FocusTrap ref={focusTrapRef} firstFocusTarget={firstFocusTarget}>
            {drawerBody}
          </FocusTrap>
        ) : (
          drawerBody
        )}
      </div>
    </div>
  )
}
