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
import { DRAWER_TRANSITION_DURATION } from './drawerTransition'
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

// スライド／フェードは shouldMount / entered の状態を見て inline style で当てる。
// （Tailwind の子孫セレクタ方式は確実に効かなかったため、transform/opacity は JS 側で制御する）
const EASING = 'cubic-bezier(0.32, 0.72, 0, 1)'
const TRANSITION_TRANSFORM = `transform ${DRAWER_TRANSITION_DURATION}ms ${EASING}`
const TRANSITION_OPACITY = `opacity ${DRAWER_TRANSITION_DURATION}ms ${EASING}`

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
    // FocusTrap の div がボックスを作ると inner の flex コンテキストが途切れる
    focusTrap: 'shr-contents',
  },
  variants: {
    position: {
      right: {
        inner: 'shr-inset-y-0 shr-right-0 shr-h-full',
      },
      left: {
        inner: 'shr-inset-y-0 shr-left-0 shr-h-full',
      },
      bottom: {
        inner: 'shr-inset-x-0 shr-bottom-0 shr-w-full shr-rounded-t-l',
      },
    },
    size: {
      S: { inner: drawerSize.S },
      M: { inner: drawerSize.M },
      L: { inner: drawerSize.L },
      FULL: { inner: drawerSize.FULL },
    },
    modality: {
      modal: {},
      modeless: { layout: 'shr-pointer-events-none' },
    },
    layoutPosition: {
      fixed: { layout: 'shr-fixed' },
      absolute: { layout: 'shr-absolute' },
    },
  },
  // パネルの上限は fixed ならビューポート、absolute ならコンテナが基準。間違えると親からはみ出す
  compoundVariants: [
    {
      position: ['right', 'left'],
      layoutPosition: 'fixed',
      class: { inner: 'shr-max-w-[calc(100dvw-theme(spacing.2))]' },
    },
    {
      position: ['right', 'left'],
      layoutPosition: 'absolute',
      class: { inner: 'shr-max-w-[calc(100%-theme(spacing.2))]' },
    },
    {
      position: 'bottom',
      layoutPosition: 'fixed',
      class: { inner: 'shr-h-[calc(100dvh-theme(spacing.2))]' },
    },
    {
      position: 'bottom',
      layoutPosition: 'absolute',
      class: { inner: 'shr-h-[calc(100%-theme(spacing.2))]' },
    },
  ],
})

// 閉じ位置（画面外）への transform 文字列
const closedTransform: Record<DrawerPosition, string> = {
  right: 'translateX(100%)',
  left: 'translateX(-100%)',
  bottom: 'translateY(100%)',
}

export const DrawerContentInner: FC<DrawerContentInnerProps> = ({
  position = 'right',
  size,
  isOpen,
  onClickClose,
  onClickOverlay,
  onPressEscape,
  ariaLabel,
  ariaLabelledby,
  modality = 'modal',
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

  // 常に autoHeadingId を指すと、ヘッダ無しのときに参照先が存在しない属性になる
  const [registeredHeadingId, setRegisteredHeadingId] = useState<string | undefined>(undefined)

  const resolvedLabelledby = useMemo(() => {
    if (ariaLabel) return undefined

    return ariaLabelledby ?? registeredHeadingId
  }, [ariaLabel, ariaLabelledby, registeredHeadingId])

  const latest = useLatest({ isOpen, onPressEscape, onClickClose, onClickOverlay })

  // 閉じアニメーション中も DOM に残るため、isOpen を見ないと再度コールバックが走る
  const functions = useMemo(
    () => ({
      handlePressEscape: () => {
        if (latest.isOpen) {
          latest.onPressEscape?.()
        }
      },
      handleClickClose: () => {
        if (latest.isOpen) {
          latest.onClickClose?.()
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

  const drag = useDrawerDrag({
    targetRef: innerRef,
    isOpen,
    onClose: functions.handleClickClose,
  })

  const classNames = useMemo(() => {
    const { layout, overlay, inner, handleArea, handleBar, focusTrap } = classNameGenerator()
    const appliedSize = position === 'bottom' ? undefined : size
    const layoutPosition = modality === 'modeless' && hasPortalParent ? 'absolute' : 'fixed'
    return {
      layout: layout({ modality, layoutPosition }),
      overlay: overlay(),
      inner: inner({ position, size: appliedSize, modality, layoutPosition, className }),
      handleArea: handleArea(),
      handleBar: handleBar(),
      focusTrap: focusTrap(),
    }
  }, [position, size, modality, hasPortalParent, className])

  // 開いた状態での inner の transform。bottom はドラッグ offset を反映、left/right は 0。
  const openedTransform = useMemo(() => {
    if (position !== 'bottom' || drag.translateOffset === 0) return 'translateY(0)'
    return `translateY(${drag.translateOffset}px)`
  }, [position, drag.translateOffset])

  // 自前のマウント＋アニメーション制御（react-transition-group は使っていない）。
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
    closeTimerRef.current = setTimeout(() => setShouldMount(false), DRAWER_TRANSITION_DURATION)
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

  const escapeCallbackRef = useEscapeCallbackRef(functions.handlePressEscape)

  useBodyScrollLock(isOpen && modality === 'modal')

  // ドラッグ中は毎フレーム再レンダーされるため、作り直すと DrawerHeader まで巻き込む
  const contentContextValue = useMemo(
    () => ({ handleClickClose: functions.handleClickClose }),
    [functions],
  )
  const headingContextValue = useMemo(
    () => ({ headingId: autoHeadingId, registerHeadingId: setRegisteredHeadingId }),
    [autoHeadingId],
  )

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
    <DrawerContentContext.Provider value={contentContextValue}>
      <DrawerHeadingContext.Provider value={headingContextValue}>
        {position === 'bottom' && handleElement}
        {children}
      </DrawerHeadingContext.Provider>
    </DrawerContentContext.Provider>
  )
  return (
    <div ref={escapeCallbackRef} id={id} className={classNames.layout}>
      {modality === 'modal' && (
        /* eslint-disable-next-line smarthr/best-practice-for-interactive-element */
        <div
          role="presentation"
          className={classNames.overlay}
          style={overlayStyle}
          onClick={isOpen ? functions.handleClickOverlay : undefined}
        />
      )}
      <div
        ref={innerRef}
        role="dialog"
        className={classNames.inner}
        style={innerStyle}
        aria-modal={modality === 'modal' || undefined}
        aria-label={ariaLabel}
        aria-labelledby={resolvedLabelledby}
      >
        {/*
          modeless でも FocusTrap を通すのは、開いたときのフォーカス移動と閉じたときの
          復帰が modal と同じく必要なため。循環（Tab のトラップ）だけを trapFocus で切る。
          両モダリティで同じ DOM 構造になる副次効果もある。
        */}
        <FocusTrap
          ref={focusTrapRef}
          firstFocusTarget={firstFocusTarget}
          trapFocus={modality === 'modal'}
          className={classNames.focusTrap}
        >
          {drawerBody}
        </FocusTrap>
      </div>
    </div>
  )
}
