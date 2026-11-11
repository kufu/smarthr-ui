'use client'

import {
  type CSSProperties,
  type FC,
  type MouseEvent,
  type PointerEvent,
  type RefObject,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { useBodyScrollLock } from '../../../hooks/client/useBodyScrollLock'
import { useEscapeCallbackRef } from '../../../hooks/client/useEscapeCallbackRef'
import { useMergeRefs } from '../../../hooks/client/useMergeRefs'
import { useLatest } from '../../../hooks/useLatest'
import { FocusTrap } from '../../FocusTrap'
import { drawerSize } from '../drawerSize'

import { DrawerContext } from './DrawerContext'
import { decayVelocity, shouldCloseOnDragEnd } from './drawerDrag'
import { DRAWER_TRANSITION_DURATION } from './drawerTransition'

import type { ExtendElementPropsWithRef } from '../../../types'
import type { DrawerSize } from '../drawerSize'
import type { DrawerModality, DrawerPosition } from '../types'

type Props = ExtendElementPropsWithRef<
  'div',
  {
    /** スライドする方向。既定は 'right' */
    position?: DrawerPosition
    /** right/left の幅。bottom では無視される */
    size?: DrawerSize
    /**
     * モーダル/非モーダルの切り替え。既定は 'modal'。
     * 'modeless' ではオーバーレイ無し・背後操作可（スクロールロック無し・Tab の循環無し・aria-modal 無し）。
     * 開いたときのドロワーへのフォーカス移動は modal と同じく行う。閉じたときのトリガへの復帰は、
     * フォーカスがドロワーの中にあるときだけ行う（背後へ移していたら、そのままにする）。
     */
    modality?: DrawerModality
    /** 開いているかどうか */
    isOpen: boolean
    /** DrawerHeader の閉じるボタン押下時と、bottom の grabber をドラッグして閉じたとき */
    onClickClose?: (e?: MouseEvent<HTMLButtonElement>) => void
    /** オーバーレイクリック時 */
    onClickOverlay?: () => void
    /** Escape 押下時 */
    onPressEscape?: (e: KeyboardEvent) => void
    /** aria-label（ariaLabelledby と排他で必須） */
    ariaLabel?: string
    /** aria-labelledby（ariaLabel と排他で必須） */
    ariaLabelledby?: string
    /**
     * 開いたときに最初にフォーカスする要素。未指定ならドロワー先頭にフォーカスする。
     * スクロール領域の見えていない位置にある要素を指定しても、その位置まではスクロールしない
     */
    firstFocusTarget?: RefObject<HTMLElement>
    /** Portal 先が指定されているか（modeless の absolute/fixed 切替に使う） */
    hasPortalParent?: boolean
    /**
     * DrawerForm から閉じるときの処理。未指定なら onClickClose を使う。
     * onClickClose で兼ねないのは、Remote 版では onClickClose が利用者の確認を挟む入口のため
     */
    handleClose?: () => void
  },
  { omit: 'style' | 'aria-label' | 'aria-labelledby' }
>

// Tailwind の子孫セレクタ方式が効かなかったため、transform/opacity は JS 側で当てる
const EASING = 'cubic-bezier(0.32, 0.72, 0, 1)'
const TRANSITION_TRANSFORM = `transform ${DRAWER_TRANSITION_DURATION}ms ${EASING}`
const TRANSITION_OPACITY = `opacity ${DRAWER_TRANSITION_DURATION}ms ${EASING}`

const classNameGenerator = tv({
  slots: {
    layout: ['smarthr-ui-Drawer-layout', 'shr-inset-0 shr-z-overlap-base'],
    overlay: ['smarthr-ui-Drawer-overlay', 'shr-absolute shr-inset-0 shr-bg-scrim'],
    inner: [
      'smarthr-ui-Drawer',
      'shr-group/drawer shr-pointer-events-auto shr-flex shr-flex-col shr-bg-white shr-shadow-layer-3',
      'contrast-more:shr-border-high-contrast',
    ],
    handleArea: [
      'smarthr-ui-Drawer-handle',
      'shr-flex shr-min-h-[1.75rem] shr-w-full shr-shrink-0 shr-cursor-row-resize shr-touch-none shr-select-none shr-items-center shr-justify-center',
    ],
    handleBar: ['shr-h-0.25 shr-w-[2.5rem] shr-rounded-full shr-bg-border'],
    // FocusTrap の div がボックスを作ると inner の flex コンテキストが途切れる
    focusTrap: 'shr-contents',
  },
  variants: {
    position: {
      right: {},
      left: {},
      bottom: {
        inner:
          'shr-border-shorthand shr-absolute shr-inset-x-0 shr-bottom-0 shr-w-full shr-rounded-t-l',
      },
    },
    size: {
      XS: { inner: drawerSize.XS },
      S: { inner: drawerSize.S },
      M: { inner: drawerSize.M },
      L: { inner: drawerSize.L },
      XL: { inner: drawerSize.XL },
      XXL: { inner: drawerSize.XXL },
      FULL: { inner: drawerSize.FULL },
    } satisfies Record<DrawerSize, { inner: string }>,
    modality: {
      modal: {},
      modeless: { layout: 'shr-pointer-events-none' },
    },
    layoutPosition: {
      fixed: { layout: 'shr-fixed' },
      absolute: { layout: 'shr-absolute' },
    },
    // 見えている高さをスクロールのたびに測ってパネルに当てる案は、パネルが伸び縮みして見づらいため採らない
    stickyInContainer: {
      true: {
        layout: 'shr-flex shr-items-start',
        inner:
          'shr-sticky shr-top-0 shr-h-[min(100%,100dvh)] shr-max-w-[calc(100%-theme(spacing.2))]',
      },
    },
  },
  // パネルの上限は fixed ならビューポート、absolute ならコンテナが基準。間違えると親からはみ出す
  compoundVariants: [
    {
      position: ['right', 'left'],
      layoutPosition: 'fixed',
      class: {
        inner:
          'shr-border-shorthand shr-absolute shr-inset-y-0 shr-h-full shr-max-w-[calc(100dvw-theme(spacing.2))]',
      },
    },
    { position: 'right', layoutPosition: 'fixed', class: { inner: 'shr-right-0' } },
    { position: 'left', layoutPosition: 'fixed', class: { inner: 'shr-left-0' } },
    // コンテナの縁に重なる辺にも境界線を引く案は、コンテナの角丸で線が途切れるため採らない。
    // justify-end / justify-start で寄せる案は、dir="rtl" の中で左右が入れ替わり、translateX でのスライドと食い違うため採らない
    {
      position: 'right',
      stickyInContainer: true,
      class: { inner: 'shr-border-l-shorthand shr-ml-auto' },
    },
    {
      position: 'left',
      stickyInContainer: true,
      class: { inner: 'shr-border-r-shorthand shr-mr-auto' },
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

const HIDDEN_BOTTOM_PROPERTY = '--smarthr-ui-drawer-hidden-bottom'

const hiddenBottomCallbackRef = (node: HTMLDivElement | null) => {
  if (!node) return

  let unsubscribe: (() => void) | undefined

  const subscribe = () => {
    unsubscribe?.()
    unsubscribe = undefined

    if (!node.hasAttribute('data-in-container')) return

    let hiddenBottom = ''
    const update = () => {
      const next = `${Math.max(0, node.getBoundingClientRect().bottom - document.documentElement.clientHeight)}px`

      if (next !== hiddenBottom) {
        hiddenBottom = next
        node.style.setProperty(HIDDEN_BOTTOM_PROPERTY, next)
      }
    }

    update()

    const resizeObserver = new ResizeObserver(update)

    resizeObserver.observe(node)
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    unsubscribe = () => {
      resizeObserver.disconnect()
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      node.style.removeProperty(HIDDEN_BOTTOM_PROPERTY)
    }
  }

  subscribe()

  const mutationObserver = new MutationObserver(subscribe)

  mutationObserver.observe(node, { attributes: true, attributeFilter: ['data-in-container'] })

  return () => {
    mutationObserver.disconnect()
    unsubscribe?.()
  }
}

const closedTransform: Record<DrawerPosition, string> = {
  right: 'translateX(100%)',
  left: 'translateX(-100%)',
  bottom: 'translateY(100%)',
}

export const DrawerContent: FC<Props> = ({
  position = 'right',
  size,
  isOpen,
  onClickClose,
  onClickOverlay,
  onPressEscape,
  ariaLabel,
  ariaLabelledby,
  modality = 'modal',
  hasPortalParent = false,
  handleClose,
  firstFocusTarget,
  className,
  children,
  ref,
  ...rest
}) => {
  const autoHeadingId = useId()
  const innerRef = useRef<HTMLDivElement>(null)

  // 常に autoHeadingId を指すと、ヘッダ無しのときに参照先が存在しない属性になる
  const [registeredHeadingId, setRegisteredHeadingId] = useState<string | undefined>(undefined)

  // ref で持たないのは、ドラッグ中はトランジションを切った再描画で指に追従させるため
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  // pointerdown のたびに測り直すパネルの実寸(px)。
  // ビューポートの回転やコンテナのリサイズで全開サイズは変わるため、開いた瞬間の値では足りない。
  const fullSizeRef = useRef(0)
  const restoreTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pointerRef = useRef<{
    pointerId: number
    startCoord: number
    lastCoord: number
    lastTime: number
    velocity: number
  } | null>(null)

  const layoutPosition = modality === 'modeless' && hasPortalParent ? 'absolute' : 'fixed'
  const isStickyInContainer = layoutPosition === 'absolute' && position !== 'bottom'

  const latest = useLatest({
    isOpen,
    onPressEscape,
    onClickClose,
    onClickOverlay,
    handleClose,
    autoHeadingId,
  })

  // 閉じアニメーション中も DOM に残るため、isOpen を見ないと再度コールバックが走る
  const functions = useMemo(() => {
    const handleClickClose = (e?: MouseEvent<HTMLButtonElement>) => {
      if (latest.isOpen) {
        latest.onClickClose?.(e)
      }
    }
    const clearRestoreTimer = () => {
      if (restoreTimerRef.current) {
        clearTimeout(restoreTimerRef.current)
        restoreTimerRef.current = null
      }
    }
    const endDragging = (offset = 0) => {
      pointerRef.current = null
      setIsDragging(false)
      setDragOffset(offset)
    }
    const cancelDragging = (e: PointerEvent<HTMLDivElement>) => {
      if (pointerRef.current?.pointerId === e.pointerId) {
        endDragging()
      }
    }

    return {
      handleClickClose,
      getIsOpen: () => latest.isOpen,
      close: () => {
        if (latest.isOpen) {
          const close = latest.handleClose ?? latest.onClickClose
          close?.()
        }
      },
      clearRestoreTimer,
      endDragging,
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
      handlePointerDown: (e: PointerEvent<HTMLDivElement>) => {
        if (latest.isOpen && e.button === 0 && e.isPrimary) {
          clearRestoreTimer()
          fullSizeRef.current = innerRef.current?.getBoundingClientRect().height ?? 0
          pointerRef.current = {
            pointerId: e.pointerId,
            startCoord: e.clientY,
            lastCoord: e.clientY,
            lastTime: e.timeStamp,
            velocity: 0,
          }
          setIsDragging(true)
          e.currentTarget.setPointerCapture?.(e.pointerId)
        }
      },
      handlePointerMove: (e: PointerEvent<HTMLDivElement>) => {
        const pointer = pointerRef.current

        if (pointer?.pointerId !== e.pointerId) return

        const coord = e.clientY
        const dt = e.timeStamp - pointer.lastTime || 1
        // 閉じ方向の速度(px/ms)。閉じる動き = サイズ減少なので velocity を負にする
        pointer.velocity = -(coord - pointer.lastCoord) / dt
        pointer.lastCoord = coord
        pointer.lastTime = e.timeStamp

        setDragOffset(Math.min(fullSizeRef.current, Math.max(0, coord - pointer.startCoord)))
      },
      handlePointerUp: (e: PointerEvent<HTMLDivElement>) => {
        const pointer = pointerRef.current

        if (pointer?.pointerId !== e.pointerId) return

        const fullSize = fullSizeRef.current
        // 最後の pointermove の座標を使わないのは、pointermove がまとめて届き、離した位置が pointerup にしか無い場合があるため
        const offset = Math.min(fullSize, Math.max(0, e.clientY - pointer.startCoord))
        const shouldClose = shouldCloseOnDragEnd({
          fullSize,
          currentSize: fullSize - offset,
          velocity: decayVelocity({
            velocity: pointer.velocity,
            idleMs: e.timeStamp - pointer.lastTime,
          }),
        })

        if (!shouldClose) {
          endDragging()

          return
        }

        // isOpen が false になるのを待つだけにしないのは、onClickClose を受けて閉じるかは利用者次第で、
        // 閉じなかった場合にパネルが画面外に居座って操作できなくなるため
        endDragging(fullSize)
        clearRestoreTimer()
        restoreTimerRef.current = setTimeout(() => {
          restoreTimerRef.current = null
          setDragOffset(0)
        }, DRAWER_TRANSITION_DURATION)
        handleClickClose()
      },
      handlePointerCancel: cancelDragging,
      handleLostPointerCapture: cancelDragging,
    }
  }, [latest])

  const classNames = useMemo(() => {
    const { layout, overlay, inner, handleArea, handleBar, focusTrap } = classNameGenerator()
    const appliedSize = position === 'bottom' ? undefined : size

    return {
      layout: layout({ modality, layoutPosition, stickyInContainer: isStickyInContainer }),
      overlay: overlay(),
      inner: inner({
        position,
        size: appliedSize,
        modality,
        layoutPosition,
        stickyInContainer: isStickyInContainer,
        className,
      }),
      handleArea: handleArea(),
      handleBar: handleBar(),
      focusTrap: focusTrap(),
    }
  }, [position, size, modality, layoutPosition, isStickyInContainer, className])

  const openedTransform = useMemo(() => {
    if (position !== 'bottom' || dragOffset === 0) return 'translateY(0)'
    return `translateY(${dragOffset}px)`
  }, [position, dragOffset])

  // react-transition-group は状態遷移が不安定だったため自前で制御する
  const [shouldMount, setShouldMount] = useState(isOpen)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    functions.endDragging()

    if (isOpen) {
      setShouldMount(true)
      setEntered(false)
      let rafId = requestAnimationFrame(() => {
        rafId = requestAnimationFrame(() => setEntered(true))
      })
      return () => {
        cancelAnimationFrame(rafId)
        functions.clearRestoreTimer()
      }
    }

    setEntered(false)
    const closeTimer = setTimeout(() => setShouldMount(false), DRAWER_TRANSITION_DURATION)
    return () => clearTimeout(closeTimer)
  }, [isOpen, functions])

  const innerStyle = useMemo<CSSProperties>(() => {
    if (isDragging) {
      return { transform: openedTransform, transition: 'none' }
    }
    return {
      transform: entered ? openedTransform : closedTransform[position],
      transition: TRANSITION_TRANSFORM,
    }
  }, [isDragging, openedTransform, entered, position])

  const overlayStyle = useMemo<CSSProperties>(
    () => ({ opacity: entered ? 1 : 0, transition: TRANSITION_OPACITY }),
    [entered],
  )

  const escapeCallbackRef = useEscapeCallbackRef(functions.handlePressEscape)
  const mergedRef = useMergeRefs(innerRef, hiddenBottomCallbackRef, ref)

  useBodyScrollLock(isOpen && modality === 'modal')

  // ドラッグ中は毎フレーム再レンダーされるため、作り直すと DrawerHeader まで巻き込む
  const contextValue = useMemo(
    () => ({
      handleClickClose: functions.handleClickClose,
      close: functions.close,
      getIsOpen: functions.getIsOpen,
      headingId: latest.autoHeadingId,
      registerHeadingId: setRegisteredHeadingId,
    }),
    [functions, latest],
  )

  if (!shouldMount) return null

  // ネイティブの属性と同じく、ariaLabel より ariaLabelledby を優先する
  const resolvedLabelledby = ariaLabelledby ?? (ariaLabel ? undefined : registeredHeadingId)

  const handleElement = (
    <div
      className={classNames.handleArea}
      aria-hidden="true"
      onLostPointerCapture={functions.handleLostPointerCapture}
      onPointerCancel={functions.handlePointerCancel}
      onPointerDown={functions.handlePointerDown}
      onPointerMove={functions.handlePointerMove}
      onPointerUp={functions.handlePointerUp}
    >
      <span className={classNames.handleBar} />
    </div>
  )
  const drawerBody = (
    <DrawerContext.Provider value={contextValue}>
      {position === 'bottom' && handleElement}
      {children}
    </DrawerContext.Provider>
  )
  return (
    <div ref={escapeCallbackRef} className={classNames.layout}>
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
        {...rest}
        ref={mergedRef}
        role="dialog"
        className={classNames.inner}
        style={innerStyle}
        aria-modal={modality === 'modal' || undefined}
        aria-label={ariaLabel}
        aria-labelledby={resolvedLabelledby}
        data-in-container={isStickyInContainer || undefined}
      >
        {/*
          スライド完了後に初回フォーカスする案は、FocusTrap がマウント直後にフォーカスするため採れない。
          スライド前の画面外の要素へのフォーカスで祖先がスクロールしないよう preventScroll を指定する。
          マウスで閉じたときにもトリガの位置までスクロールさせる案は、modeless でページをスクロールしたあとに
          閉じるとページが突然飛ぶため採らない
        */}
        <FocusTrap
          firstFocusTarget={firstFocusTarget}
          trapFocus={modality === 'modal'}
          preventScroll
          className={classNames.focusTrap}
        >
          {drawerBody}
        </FocusTrap>
      </div>
    </div>
  )
}
