'use client'

import {
  type ComponentProps,
  type FC,
  type KeyboardEvent,
  type MouseEvent,
  type PropsWithChildren,
  type ReactNode,
  type RefObject,
  memo,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import Draggable from 'react-draggable'
import { type VariantProps, tv } from 'tailwind-variants'

import { useHandleEscape } from '../../../hooks/useHandleEscape'
import { useIntl } from '../../../intl'
import { dialogSize } from '../../../themes/tailwind'
import { Base, type BaseElementProps } from '../../Base'
import { Button } from '../../Button'
import { Heading } from '../../Heading'
import { FaGripIcon, FaXmarkIcon } from '../../Icon'
import { DialogBody, type Props as DialogBodyProps } from '../DialogBody'
import { DialogOverlap } from '../DialogOverlap'
import { useDialogPortal } from '../useDialogPortal'

import type { DecoratorsType } from '../../../hooks/useDecorators'
import type { DialogSize } from '../types'

type AbstractProps = PropsWithChildren<{
  /**
   * ダイアログのタイトルの内容
   */
  heading: ReactNode
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
   * @deprecated ダイアログの幅を指定する場合は、`width` ではなく `size` を使用してください。
   * ダイアログの幅
   */
  width?: string | number
  /**
   * ダイアログの大きさ
   */
  size?: DialogSize
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
type Props = AbstractProps &
  Omit<DialogBodyProps, keyof AbstractProps> &
  Omit<BaseElementProps, keyof AbstractProps> &
  Omit<VariantProps<typeof classNameGenerator>, keyof AbstractProps>

const classNameGenerator = tv({
  slots: {
    overlap: 'shr-inset-[unset]',
    wrapper: 'smarthr-ui-ModelessDialog shr-fixed shr-flex shr-flex-col',
    headerEl:
      'smarthr-ui-ModelessDialog-header shr-border-b-shorthand shr-relative shr-flex shr-cursor-move shr-items-center shr-rounded-tl-l shr-rounded-tr-l shr-pe-1 shr-ps-1.5 hover:shr-bg-white-darken',
    dialogHandler: [
      'smarthr-ui-ModelessDialog-handle shr-absolute shr-inset-x-0 shr-bottom-0 shr-top-[2px] shr-m-auto shr-flex shr-justify-center shr-rounded-tl-s shr-rounded-tr-s shr-text-grey shr-transition-colors shr-duration-100 shr-ease-in-out',
      'focus-visible:shr-bg-white-darken focus-visible:shr-shadow-outline focus-visible:shr-outline-none',
    ],
    headingEl: [
      'shr-my-1 shr-me-1',
      /* DialogHandlerの上に出すためにスタッキングコンテキストを生成 */
      '[.smarthr-ui-ModelessDialog-handle:focus-visible_+_&]:shr-relative',
    ],
    closeButtonLayout: [
      'shr-relative' /* DialogHandlerの上に出すためにスタッキングコンテキストを生成 */,
      'shr-ml-auto shr-shrink-0',
    ],
    footerEl: 'smarthr-ui-ModelessDialog-footer shr-border-t-shorthand',
  },
  variants: {
    size: {
      XS: { wrapper: dialogSize.XS },
      S: { wrapper: dialogSize.S },
      M: { wrapper: dialogSize.M },
      L: { wrapper: dialogSize.L },
      XL: { wrapper: dialogSize.XL },
      XXL: { wrapper: dialogSize.XXL },
      FULL: { wrapper: dialogSize.FULL },
    },
    resizable: {
      true: {
        wrapper: 'shr-resize shr-overflow-auto',
      },
      false: {},
    },
  },
})

export const ModelessDialog: FC<Props> = ({
  heading,
  children,
  contentBgColor,
  contentPadding,
  footer,
  isOpen,
  onPressEscape,
  resizable = false,
  width,
  size,
  height,
  top,
  left,
  right,
  bottom,
  portalParent,
  className,
  decorators,
  id,
  onClickClose,
  ...rest
}) => {
  const labelId = useId()
  const lastFocusElementRef = useRef<HTMLElement | null>(null)
  const { createPortal } = useDialogPortal(portalParent, id)
  const { localize } = useIntl()

  const classNames = useMemo(() => {
    const { overlap, wrapper, headerEl, headingEl, dialogHandler, closeButtonLayout, footerEl } =
      classNameGenerator()

    return {
      overlap: overlap({ className }),
      wrapper: wrapper({ size, resizable }),
      header: headerEl(),
      heading: headingEl(),
      dialogHandler: dialogHandler(),
      closeButtonLayout: closeButtonLayout(),
      footer: footerEl(),
    }
  }, [className, size, resizable])

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

  const decoratorDefaultTexts = useMemo(
    () => ({
      closeButtonIconAlt: localize({
        id: 'smarthr-ui/ModelessDialog/closeButtonIconAlt',
        defaultText: '閉じる',
      }),
      dialogHandlerAriaLabel: localize({
        id: 'smarthr-ui/ModelessDialog/dialogHandlerAriaLabel',
        defaultText: 'ダイアログの位置',
      }),
      dialogHandlerAriaValuetext: wrapperPosition
        ? localize(
            {
              id: 'smarthr-ui/ModelessDialog/dialogHandlerAriaValuetext',
              defaultText: '上から{top}px、左から{left}px',
            },
            {
              top: Math.trunc(wrapperPosition.top).toString(),
              left: Math.trunc(wrapperPosition.left).toString(),
            },
          )
        : '',
    }),
    [localize, wrapperPosition],
  )

  const decorated = useMemo(() => {
    if (!decorators) {
      return {
        dialogHandlerAriaLabel: decoratorDefaultTexts.dialogHandlerAriaLabel,
        closeButtonIconAlt: decoratorDefaultTexts.closeButtonIconAlt,
        dialogHandlerAriaValuetext: decoratorDefaultTexts.dialogHandlerAriaValuetext,
      }
    }

    return {
      dialogHandlerAriaLabel:
        decorators.dialogHandlerAriaLabel?.(decoratorDefaultTexts.dialogHandlerAriaLabel) ||
        decoratorDefaultTexts.dialogHandlerAriaLabel,
      closeButtonIconAlt:
        decorators.closeButtonIconAlt?.(decoratorDefaultTexts.closeButtonIconAlt) ||
        decoratorDefaultTexts.closeButtonIconAlt,
      dialogHandlerAriaValuetext: decorators.dialogHandlerAriaValuetext?.(
        decoratorDefaultTexts.dialogHandlerAriaValuetext,
        wrapperPosition,
      ),
    }
  }, [decorators, decoratorDefaultTexts, wrapperPosition])

  const positionStyle = useMemo(
    () => ({
      top: centering.top ?? top,
      left: centering.left ?? left,
      right,
      bottom,
      width: size ? undefined : width,
      height,
    }),
    [centering, top, left, right, bottom, width, height, size],
  )

  const handleArrowKey = useCallback(
    (e: KeyboardEvent) => {
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

  const actualOnClickClose = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      lastFocusElementRef.current?.focus()
      onClickClose?.(e)
    },
    [onClickClose],
  )

  const actualOnPressEscape = useMemo(
    () =>
      onPressEscape
        ? () => {
            lastFocusElementRef.current?.focus()
            onPressEscape()
          }
        : undefined,
    [onPressEscape],
  )

  useHandleEscape(
    useMemo(
      () => (actualOnPressEscape && isOpen ? actualOnPressEscape : undefined),
      [isOpen, actualOnPressEscape],
    ),
  )

  useEffect(() => {
    const focusHandler = (e: FocusEvent) => {
      // e.target(現在フォーカスがあたっている要素)がModeless dialog外の要素であれば、lastFocusElementRefに代入する
      if (e.target instanceof HTMLElement && !wrapperRef?.current?.contains(e.target)) {
        lastFocusElementRef.current = e.target
      }
    }

    document.addEventListener('focus', focusHandler, true)

    return () => document.removeEventListener('focus', focusHandler, true)
  }, [])

  const onDragStart = useCallback((_: any, data: { x: number; y: number }) => setPosition(data), [])
  const onDrag = useCallback((_: any, data: { deltaX: number; deltaY: number }) => {
    setPosition((prev) => ({
      x: prev.x + data.deltaX,
      y: prev.y + data.deltaY,
    }))
  }, [])

  return createPortal(
    <DialogOverlap isOpen={isOpen} className={classNames.overlap} as="section">
      <Draggable
        handle=".smarthr-ui-ModelessDialog-handle"
        onStart={onDragStart}
        onDrag={onDrag}
        position={position}
        bounds={draggableBounds}
        nodeRef={wrapperRef}
      >
        <Base
          {...rest}
          ref={wrapperRef}
          role="dialog"
          aria-labelledby={labelId}
          radius="m"
          layer={3}
          overflow="auto"
          className={classNames.wrapper}
          style={positionStyle}
        >
          {/* dummy element for focus management. */}
          <div tabIndex={-1} ref={focusTargetRef} />
          <div className={classNames.header}>
            <Handler
              aria-label={decorated.dialogHandlerAriaLabel}
              aria-valuetext={decorated.dialogHandlerAriaValuetext}
              onArrowKeyDown={handleArrowKey}
              className={classNames.dialogHandler}
            />
            <div id={labelId} className={classNames.heading}>
              {/* eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content */}
              <Heading>{heading}</Heading>
            </div>
            <CloseButton
              onClick={actualOnClickClose}
              className={classNames.closeButtonLayout}
              iconAlt={decorated.closeButtonIconAlt}
            />
          </div>
          <DialogBody
            contentBgColor={contentBgColor}
            contentPadding={contentPadding}
            className="smarthr-ui-ModelessDialog-content shr-overscroll-contain"
          >
            {children}
          </DialogBody>
          {footer && <div className={classNames.footer}>{footer}</div>}
        </Base>
      </Draggable>
    </DialogOverlap>,
  )
}

const Handler = memo<{
  'aria-label': string
  'aria-valuetext': string | undefined
  className: string
  onArrowKeyDown: (e: KeyboardEvent) => void
}>(({ onArrowKeyDown, ...rest }) => (
  // eslint-disable-next-line jsx-a11y/role-has-required-aria-props
  <div {...rest} tabIndex={0} role="slider" onKeyDown={onArrowKeyDown}>
    <FaGripIcon />
  </div>
))

const CloseButton = memo<{
  className: string
  iconAlt: ReactNode
  onClick: (e: MouseEvent<HTMLButtonElement>) => void
}>(({ onClick, iconAlt, className }) => (
  <div className={className}>
    <Button
      type="button"
      size="s"
      onClick={onClick}
      className="smarthr-ui-ModelessDialog-closeButton"
    >
      <FaXmarkIcon alt={iconAlt} />
    </Button>
  </div>
))
