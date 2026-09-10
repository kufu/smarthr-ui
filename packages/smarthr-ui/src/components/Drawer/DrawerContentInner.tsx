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
import { useIntl } from '../../intl'
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
    // 上辺中央の横バー（grabber）。vaul 風の pill 形状
    handleArea: [
      'smarthr-ui-Drawer-handle',
      'shr-flex shr-min-h-[1.75rem] shr-w-full shr-shrink-0 shr-cursor-row-resize shr-touch-none shr-items-center shr-justify-center shr-border-none shr-bg-[unset] shr-p-0',
      'focus-visible:shr-focus-indicator',
    ],
    handleBar: ['shr-h-0.25 shr-w-[2.5rem] shr-rounded-full shr-bg-border'],
  },
  variants: {
    position: {
      right: { inner: 'shr-inset-y-0 shr-right-0 shr-h-full' },
      left: { inner: 'shr-inset-y-0 shr-left-0 shr-h-full' },
      bottom: { inner: 'shr-inset-x-0 shr-bottom-0 shr-max-h-full shr-w-full shr-rounded-t-l' },
      top: { inner: 'shr-inset-x-0 shr-top-0 shr-max-h-full shr-w-full shr-rounded-b-l' },
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

const isVertical = (position: DrawerPosition) => position === 'bottom' || position === 'top'

// 閉じ位置（画面外）への transform 文字列
const closedTransform: Record<DrawerPosition, string> = {
  right: 'translateX(100%)',
  left: 'translateX(-100%)',
  bottom: 'translateY(100%)',
  top: 'translateY(-100%)',
}

// snapPoints を px 昇順配列へ正規化（縦方向用）。
// 対応単位: 比率(0〜1の数値) / px / vh / dvh / svh / lvh / %
const normalizeSnapPoints = (snapPoints: Array<number | string> | undefined): number[] => {
  const viewport = typeof window === 'undefined' ? 0 : window.innerHeight
  const points = (snapPoints && snapPoints.length > 0 ? snapPoints : [1]).map((p) => {
    if (typeof p === 'number') return p <= 1 ? p * viewport : p
    const match = /^([\d.]+)(px|vh|dvh|svh|lvh|%)?$/.exec(p.trim())
    if (!match) return viewport
    const value = parseFloat(match[1])
    if (match[2] === 'px') return value
    // vh/dvh/svh/lvh/% は viewport 比率として扱う
    return (value / 100) * viewport
  })
  return [...points].sort((a, b) => a - b)
}

export const DrawerContentInner: FC<DrawerContentInnerProps> = ({
  position = 'right',
  size,
  snapPoints,
  defaultSnapPoint,
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
  const vertical = isVertical(position)
  const { localize } = useIntl()
  const handleDescriptionId = useId()
  const autoHeadingId = useId()
  const innerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)

  const resolvedLabelledby = useMemo(() => {
    if (ariaLabel) return undefined
    return ariaLabelledby ?? autoHeadingId
  }, [ariaLabel, ariaLabelledby, autoHeadingId])

  const normalizedSnaps = useMemo(
    () => (vertical ? normalizeSnapPoints(snapPoints) : [1]),
    [vertical, snapPoints],
  )
  const initialIndex = useMemo(() => {
    if (!vertical || defaultSnapPoint === undefined) return normalizedSnaps.length - 1
    const normalizedDefault = normalizeSnapPoints([defaultSnapPoint])[0]
    const idx = normalizedSnaps.findIndex((p) => p >= normalizedDefault)
    return idx === -1 ? normalizedSnaps.length - 1 : idx
  }, [vertical, defaultSnapPoint, normalizedSnaps])

  const drag = useDrawerDrag({
    position,
    snapPoints: normalizedSnaps,
    initialIndex,
    isOpen,
    onClose: onClickClose,
  })

  const classNames = useMemo(() => {
    const { layout, overlay, inner, handleArea, handleBar } = classNameGenerator()
    const appliedSize = vertical ? undefined : size
    const layoutPosition = variant === 'modeless' && hasPortalParent ? 'absolute' : 'fixed'
    return {
      layout: layout({ variant, layoutPosition }),
      overlay: overlay(),
      inner: inner({ position, size: appliedSize, variant, className }),
      handleArea: handleArea(),
      handleBar: handleBar(),
    }
  }, [vertical, position, size, variant, hasPortalParent, className])

  // 縦方向で複数スナップのときはパネル高を最大スナップに固定する
  const hasMultipleSnaps = vertical && normalizedSnaps.length > 1
  const fixedHeight = useMemo(
    () => (hasMultipleSnaps ? `${normalizedSnaps[normalizedSnaps.length - 1]}px` : undefined),
    [hasMultipleSnaps, normalizedSnaps],
  )

  // 開いた状態での inner の transform。縦方向はスナップ offset を反映、横は 0。
  const openedTransform = useMemo(() => {
    if (!vertical || drag.translateOffset === 0) return 'translateY(0)'
    const axis = position === 'bottom' ? 1 : -1
    return `translateY(${axis * drag.translateOffset}px)`
  }, [vertical, position, drag.translateOffset])

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
    const base: CSSProperties = { height: fixedHeight }
    // ドラッグ中は補間を切って指に追従
    if (drag.isDragging) {
      return { ...base, transform: openedTransform, transition: 'none' }
    }
    return {
      ...base,
      transform: entered ? openedTransform : closedTransform[position],
      transition: TRANSITION_TRANSFORM,
    }
  }, [fixedHeight, drag.isDragging, openedTransform, entered, position])

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

  const handleTexts = useMemo(
    () => ({
      ariaLabel: localize({
        id: 'smarthr-ui/Drawer/handleAriaLabel',
        defaultText: 'ドロワーの大きさ',
      }),
      roleDescription: localize({
        id: 'smarthr-ui/Drawer/handleAriaRoleDescription',
        defaultText: 'ドラッグ可能',
      }),
      description: localize({
        id: 'smarthr-ui/Drawer/handleDescription',
        defaultText: '上下の矢印キーを押して大きさを変更できます',
      }),
    }),
    [localize],
  )

  const onClickCloseSafe = useMemo(() => onClickClose ?? (() => undefined), [onClickClose])

  if (!shouldMount) return null

  const handleElement = (
    <>
      <button
        type="button"
        className={classNames.handleArea}
        aria-label={handleTexts.ariaLabel}
        aria-roledescription={handleTexts.roleDescription}
        aria-describedby={handleDescriptionId}
        onPointerDown={drag.onPointerDown}
        onPointerMove={drag.onPointerMove}
        onPointerUp={drag.onPointerUp}
        onPointerCancel={drag.onPointerCancel}
        onKeyDown={drag.onHandleKeyDown}
      >
        <span className={classNames.handleBar} />
      </button>
      <div id={handleDescriptionId} className="shr-sr-only">
        {handleTexts.description}
      </div>
    </>
  )
  const drawerBody = (
    <DrawerContentContext.Provider value={{ onClickClose: onClickCloseSafe }}>
      <DrawerHeadingContext.Provider value={{ headingId: autoHeadingId }}>
        {vertical && position === 'bottom' && handleElement}
        {children}
        {vertical && position === 'top' && handleElement}
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
