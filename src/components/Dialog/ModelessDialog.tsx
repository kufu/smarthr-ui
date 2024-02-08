import React, {
  ComponentProps,
  FC,
  MouseEvent,
  PropsWithChildren,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import Draggable from 'react-draggable'
import { tv } from 'tailwind-variants'

import { useHandleEscape } from '../../hooks/useHandleEscape'
import { useId } from '../../hooks/useId'
import { useTheme } from '../../hooks/useTailwindTheme'
import { Base, BaseElementProps } from '../Base'
import { Button } from '../Button'
import { FaGripHorizontalIcon, FaTimesIcon } from '../Icon'

import { DialogOverlap } from './DialogOverlap'
import { useDialogPortal } from './useDialogPortal'

import type { DecoratorsType } from '../../types'

type Props = PropsWithChildren<{
  /**
   * ダイアログのヘッダ部分の内容
   */
  header: ReactNode
  /**
   * ダイアログのフッタ部分の内容
   */
  footer?: ReactNode
  /**
   * ダイアログが開かれているかどうかの真偽値
   */
  isOpen: boolean
  /**
   * 閉じるボタンを押下したときのハンドラ
   */
  onClickClose?: (e: MouseEvent<HTMLButtonElement>) => void
  /**
   * ダイアログが開いている状態で Escape キーを押下したときのハンドラ
   */
  onPressEscape?: () => void
  /**
   * ダイアログの幅
   */
  width?: string | number
  /**
   * ダイアログの高さ
   */
  height?: string | number
  /**
   * ダイアログを開いたときの初期 top 位置
   */
  top?: string | number
  /**
   * ダイアログを開いたときの初期 left 位置
   */
  left?: string | number
  /**
   * ダイアログを開いたときの初期 right 位置
   */
  right?: string | number
  /**
   * ダイアログを開いたときの初期 bottom 位置
   */
  bottom?: string | number
  /**
   * ポータルの container となる DOM 要素を追加する親要素
   */
  portalParent?: HTMLElement | RefObject<HTMLElement>
  /** コンポーネント内の文言を変更するための関数を設定 */
  decorators?: DecoratorsType<'closeButtonIconAlt'> & {
    dialogHandlerAriaLabel?: (txt: string) => string
    dialogHandlerAriaValuetext?: (txt: string, data: DOMRect | undefined) => string
  }
}>

const DIALOG_HANDLER_ARIA_LABEL = 'ダイアログの位置'
const CLOSE_BUTTON_ICON_ALT = '閉じる'

const modelessDialog = tv({
  slots: {
    layout: 'smarthr-ui-ModelessDialog shr-fixed',
    box: 'smarthr-ui-ModelessDialog-box shr-flex shr-h-full shr-max-h-full shr-flex-col',
    headerEl:
      'smarthr-ui-ModelessDialog-header shr-border-b-shorthand shr-relative shr-flex shr-cursor-move shr-items-center shr-rounded-tl-l shr-rounded-tr-l shr-pe-1 shr-ps-1.5 hover:shr-bg-white-darken',
    dialogHandler: [
      'smarthr-ui-ModelessDialog-handle shr-absolute shr-inset-x-0 shr-bottom-0 shr-top-[2px] shr-m-auto shr-flex shr-justify-center shr-rounded-tl-s shr-rounded-tr-s shr-text-grey shr-transition-colors shr-duration-100 shr-ease-in-out',
      'focus-visible:shr-bg-white-darken focus-visible:shr-shadow-outline focus-visible:shr-outline-none',
    ],
    title: [
      'shr-relative' /* DialogHandlerの上に出すためにスタッキングコンテキストを生成 */,
      'shr-my-1 shr-me-1',
    ],
    closeButtonLayout: [
      'shr-relative' /* DialogHandlerの上に出すためにスタッキングコンテキストを生成 */,
      'shr-ml-auto shr-shrink-0',
    ],
    content:
      'smarthr-ui-ModelessDialog-content shr-flex-1 shr-overflow-auto shr-overscroll-contain',
    footerEl: 'smarthr-ui-ModelessDialog-footer shr-border-t-shorthand',
  },
})

export const ModelessDialog: FC<Props & BaseElementProps> = ({
  header,
  children,
  footer,
  isOpen,
  onClickClose,
  onPressEscape,
  width,
  height,
  top,
  left,
  right,
  bottom,
  portalParent,
  className,
  decorators,
  id,
  ...props
}) => {
  const labelId = useId()
  const { createPortal } = useDialogPortal(portalParent, id)
  const { spacing } = useTheme()

  const {
    layoutStyle,
    boxStyle,
    headerStyle,
    titleStyle,
    dialogHandlerStyle,
    closeButtonLayoutStyle,
    contentStyle,
    footerStyle,
  } = useMemo(() => {
    const { layout, box, headerEl, title, dialogHandler, closeButtonLayout, content, footerEl } =
      modelessDialog()
    return {
      layoutStyle: layout({ className }),
      boxStyle: box(),
      headerStyle: headerEl(),
      titleStyle: title(),
      dialogHandlerStyle: dialogHandler(),
      closeButtonLayoutStyle: closeButtonLayout(),
      contentStyle: content(),
      footerStyle: footerEl(),
    }
  }, [className])
  const boxStyleProps = useMemo(() => {
    const leftMargin = typeof left === 'number' ? `${left}px` : left
    const rightMargin = typeof right === 'number' ? `${right}px` : right
    /* TODO: 幅の定数指定は、トークンが決まり theme に入ったら差し替える */
    const style =
      width === undefined
        ? {
            maxWidth: `min(calc(100vw - max(${leftMargin || 0}, ${spacing[0.5]}) - max(${
              rightMargin || 0
            }, ${spacing[0.5]})), 800px)`,
          }
        : undefined
    return {
      className: boxStyle,
      style,
    }
  }, [boxStyle, left, right, spacing, width])

  const wrapperRef = useRef<HTMLDivElement>(null)
  const focusTargetRef = useRef<HTMLDivElement>(null)

  const [wrapperPosition, setWrapperPosition] = useState<DOMRect | undefined>(undefined)
  const [centering, setCentering] = useState<{
    top?: number
    left?: number
  }>({})
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })
  const [draggableBounds, setDraggableBounds] =
    useState<ComponentProps<typeof Draggable>['bounds']>()

  const dialogHandlerAriaLabel = useMemo(
    () =>
      decorators?.dialogHandlerAriaLabel?.(DIALOG_HANDLER_ARIA_LABEL) || DIALOG_HANDLER_ARIA_LABEL,
    [decorators],
  )
  const defaultAriaValuetext = useMemo(
    () =>
      wrapperPosition
        ? `上から${Math.trunc(wrapperPosition.top)}px、左から${Math.trunc(wrapperPosition.left)}px`
        : '',
    [wrapperPosition],
  )
  const dialogHandlerAriaValuetext = useMemo(
    () =>
      defaultAriaValuetext
        ? decorators?.dialogHandlerAriaValuetext?.(defaultAriaValuetext, wrapperPosition) ||
          defaultAriaValuetext
        : undefined,
    [defaultAriaValuetext, wrapperPosition, decorators],
  )
  const closeButtonIconAlt = useMemo(
    () => decorators?.closeButtonIconAlt?.(CLOSE_BUTTON_ICON_ALT) || CLOSE_BUTTON_ICON_ALT,
    [decorators],
  )

  const topStyle = centering.top !== undefined ? centering.top : top
  const leftStyle = centering.left !== undefined ? centering.left : left

  const handleArrowKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen || document.activeElement !== e.currentTarget) {
        return
      }
      const movingDistance = 20
      switch (e.key) {
        case 'ArrowUp':
          setPosition((prev) => ({
            x: prev.x,
            y: prev.y - movingDistance,
          }))
          e.preventDefault()
          break
        case 'ArrowDown':
          setPosition((prev) => ({
            x: prev.x,
            y: prev.y + movingDistance,
          }))
          e.preventDefault()
          break
        case 'ArrowLeft':
          setPosition((prev) => ({
            x: prev.x - movingDistance,
            y: prev.y,
          }))
          e.preventDefault()
          break
        case 'ArrowRight':
          setPosition((prev) => ({
            x: prev.x + movingDistance,
            y: prev.y,
          }))
          e.preventDefault()
          break
      }
    },
    [isOpen],
  )

  useEffect(() => {
    if (wrapperRef.current instanceof Element) {
      setWrapperPosition(wrapperRef.current.getBoundingClientRect())
    }
  }, [position])

  useEffect(() => {
    // 中央寄せの座標計算を行う
    if (!wrapperRef.current || !isOpen) {
      return
    }
    const isXCenter = left === undefined && right === undefined
    const isYCenter = top === undefined && bottom === undefined
    if (isXCenter || isYCenter) {
      const rect = wrapperRef.current.getBoundingClientRect()
      setCentering({
        top: isYCenter ? window.innerHeight / 2 - rect.height / 2 : undefined,
        left: isXCenter ? window.innerWidth / 2 - rect.width / 2 : undefined,
      })
    }
  }, [bottom, isOpen, left, right, top])

  useEffect(() => {
    if (!isOpen) return

    if (centering.top) {
      setDraggableBounds({ top: centering.top * -1 })
      return
    }

    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect()
      setDraggableBounds({ top: rect.top * -1 })
    }
  }, [isOpen, centering.top])

  useEffect(() => {
    if (isOpen) {
      setPosition({ x: 0, y: 0 })
      focusTargetRef.current?.focus()
    }
  }, [isOpen])

  useHandleEscape(
    useCallback(() => {
      if (isOpen) {
        onPressEscape && onPressEscape()
      }
    }, [isOpen, onPressEscape]),
  )

  return createPortal(
    <DialogOverlap isOpen={isOpen}>
      <Draggable
        handle=".smarthr-ui-ModelessDialog-handle"
        onStart={(_, data) => setPosition({ x: data.x, y: data.y })}
        onDrag={(_, data) => {
          setPosition((prev) => ({
            x: prev.x + data.deltaX,
            y: prev.y + data.deltaY,
          }))
        }}
        position={position}
        bounds={draggableBounds}
      >
        <div
          {...props}
          className={layoutStyle}
          style={{
            top: topStyle,
            left: leftStyle,
            right,
            bottom,
            width,
            height,
          }}
          ref={wrapperRef}
          role="dialog"
          aria-labelledby={labelId}
        >
          <Base {...boxStyleProps} radius="m" layer={3}>
            <div tabIndex={-1} ref={focusTargetRef}>
              {/* dummy element for focus management. */}
            </div>
            <div className={headerStyle}>
              <div
                className={dialogHandlerStyle}
                tabIndex={0}
                role="slider"
                aria-label={dialogHandlerAriaLabel}
                aria-valuetext={dialogHandlerAriaValuetext}
                onKeyDown={handleArrowKey}
              >
                <FaGripHorizontalIcon />
              </div>
              <div id={labelId} className={titleStyle}>
                {header}
              </div>
              <div className={closeButtonLayoutStyle}>
                <Button
                  type="button"
                  size="s"
                  square
                  onClick={onClickClose}
                  className="smarthr-ui-ModelessDialog-closeButton"
                >
                  <FaTimesIcon alt={closeButtonIconAlt} />
                </Button>
              </div>
            </div>
            <div className={contentStyle}>{children}</div>
            {footer && <div className={footerStyle}>{footer}</div>}
          </Base>
        </div>
      </Draggable>
    </DialogOverlap>,
  )
}
