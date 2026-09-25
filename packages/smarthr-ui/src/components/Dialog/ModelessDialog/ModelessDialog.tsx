'use client'

import {
  type FC,
  type KeyboardEvent,
  type MouseEvent,
  type PropsWithChildren,
  type ReactNode,
  type RefObject,
  type SetStateAction,
  memo,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import Draggable, { type DraggableBounds } from 'react-draggable'
import { tv } from 'tailwind-variants'

import { useAnimationFrame } from '../../../hooks/client/useAnimationFrame'
import { useEscapeCallbackRef } from '../../../hooks/client/useEscapeCallbackRef'
import { useLayoutEffectRef } from '../../../hooks/client/useLayoutEffectRef'
import { useMergeRefs } from '../../../hooks/client/useMergeRefs'
import { useLatest } from '../../../hooks/useLatest'
import { Localizer, useIntl } from '../../../intl'
import { getSafeAreaInsets } from '../../../libs/safeAreaInsets'
import { dialogSize } from '../../../tailwind'
import { Button } from '../../Button'
import { Heading } from '../../Heading'
import { FaGripIcon, FaXmarkIcon } from '../../Icon'
import { LiveRegion } from '../../LiveRegion'
import { Panel, type PanelElementProps } from '../../Panel'
import { DialogBody, type Props as DialogBodyProps } from '../DialogBody'
import { DialogOverlap } from '../DialogOverlap'
import { useDialogPortal } from '../useDialogPortal'

import type { DialogSize } from '../types'

type BaseProps = PropsWithChildren<{
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
  /**
   * リサイズ可能かどうか
   */
  resizable?: boolean
}>
type Props = BaseProps &
  Omit<DialogBodyProps, keyof BaseProps> &
  Omit<PanelElementProps, keyof BaseProps>

const classNameGenerator = tv({
  slots: {
    overlap: 'shr-inset-[unset]',
    wrapper: [
      'smarthr-ui-ModelessDialog shr-fixed shr-flex shr-flex-col',
      'shr-max-h-[calc(100svh-theme(spacing[0.5])-env(safe-area-inset-top)-env(safe-area-inset-bottom))]',
      'shr-max-w-[calc(100vw-theme(spacing[0.5])-env(safe-area-inset-left)-env(safe-area-inset-right))]',
    ],
    headerEl: [
      'smarthr-ui-ModelessDialog-header shr-border-b-shorthand shr-relative shr-flex shr-cursor-move shr-items-center',
      'shr-rounded-tl-l shr-rounded-tr-l shr-pe-1 shr-ps-1.5',
      'hover:shr-bg-white-darken',
      /* DialogHandlerにフォーカスが当たっているときは、headerもフォーカス状態のスタイルにする。 */
      'has-[.smarthr-ui-ModelessDialog-handle:focus-visible]:shr-focus-indicator',
      'has-[.smarthr-ui-ModelessDialog-handle:focus-visible]:shr-bg-white-darken',
      'has-[.smarthr-ui-ModelessDialog-handle:focus-visible]:shr-transition-colors',
      'has-[.smarthr-ui-ModelessDialog-handle:focus-visible]:shr-duration-100',
      'has-[.smarthr-ui-ModelessDialog-handle:focus-visible]:shr-ease-in-out',
    ],
    dialogHandler: [
      'smarthr-ui-ModelessDialog-handle',
      'shr-absolute shr-inset-x-0 shr-bottom-0 shr-top-[2px]',
      'shr-m-auto shr-flex shr-justify-center shr-rounded-tl-s shr-rounded-tr-s shr-border-none',
      'shr-text-grey shr-transition-colors shr-duration-100 shr-ease-in-out',
      'focus-visible:shr-focus-indicator--none shr-cursor-[inherit] shr-bg-[unset]',
    ],
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
    } satisfies Record<NonNullable<BaseProps['size']>, { wrapper: string }>,
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
  onClickClose,
  ...rest
}) => {
  const baseId = useId()
  const labelId = `${baseId}-label`
  const lastFocusElementRef = useRef<HTMLElement | null>(null)
  // HINT: top/left/right/bottomは「開いたときの初期位置」であるため、
  // 開いている最中のprops変更では追従させず、開くたびに最新の値へ更新する
  const [defaultPosition, setDefaultPosition] = useState(() => ({ top, left, right, bottom }))
  const { createPortal } = useDialogPortal(portalParent)
  const { localize } = useIntl()

  const classNames = useMemo(() => {
    const { overlap, wrapper, headerEl, dialogHandler } = classNameGenerator()

    return {
      overlap: overlap({ className }),
      wrapper: wrapper({ size, resizable }),
      header: headerEl(),
      dialogHandler: dialogHandler(),
    }
  }, [className, size, resizable])

  const wrapperRef = useRef<HTMLDivElement>(null)

  const wrapperPositionRef = useRef<{ top: number; left: number } | undefined>(undefined)
  const [liveRegionText, setLiveRegionText] = useState<string>('')
  const [centering, setCentering] = useState<{
    top?: number
    left?: number
  }>({})
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })
  const [draggableBounds, setDraggableBounds] = useState(Draggable.defaultProps.bounds)

  const liveRegionFrame = useAnimationFrame()
  const latest = useLatest({
    isOpen,
    onClickClose,
    onPressEscape,
    top,
    left,
    right,
    bottom,
    defaultPosition,
    centering,
    position,
    localize,
    liveRegionFrame,
  })

  const functions = useMemo(() => {
    const setActualPosition = (pos: SetStateAction<{ x: number; y: number }>) => {
      setPosition(pos)

      latest.liveRegionFrame.request(() => {
        const wrapperPosition = wrapperRef.current
          ? wrapperRef.current.getBoundingClientRect()
          : undefined

        if (!wrapperPosition) {
          setLiveRegionText('')
          return
        }

        const oldPosition = wrapperPositionRef.current

        wrapperPositionRef.current = wrapperPosition

        if (
          !oldPosition ||
          wrapperPosition.top !== oldPosition.top ||
          wrapperPosition.left !== oldPosition.left
        ) {
          setLiveRegionText(
            latest.localize(
              {
                id: 'smarthr-ui/ModelessDialog/dialogHandlerLiveRegionText',
                defaultText: '上から{top}px、左から{left}px',
              },
              {
                top: Math.trunc(wrapperPosition.top).toString(),
                left: Math.trunc(wrapperPosition.left).toString(),
              },
            ),
          )
        }
      })
    }

    return {
      cleanupLiveRegion: () => {
        latest.liveRegionFrame.cancel()
      },
      setActualPosition,
      handleArrowKeyDown: (e: KeyboardEvent) => {
        if (!latest.isOpen || document.activeElement !== e.currentTarget) {
          return
        }

        const movingDistance = 20

        switch (e.key) {
          case 'ArrowUp':
            setActualPosition((prev) => ({
              x: prev.x,
              y: prev.y - movingDistance,
            }))
            e.preventDefault()
            break
          case 'ArrowDown':
            setActualPosition((prev) => ({
              x: prev.x,
              y: prev.y + movingDistance,
            }))
            e.preventDefault()
            break
          case 'ArrowLeft':
            setActualPosition((prev) => ({
              x: prev.x - movingDistance,
              y: prev.y,
            }))
            e.preventDefault()
            break
          case 'ArrowRight':
            setActualPosition((prev) => ({
              x: prev.x + movingDistance,
              y: prev.y,
            }))
            e.preventDefault()
            break
        }
      },
      handleClickClose: (e: MouseEvent<HTMLButtonElement>) => {
        lastFocusElementRef.current?.focus()
        latest.onClickClose?.(e)
      },
      handlePressEscape: () => {
        lastFocusElementRef.current?.focus()
        latest.onPressEscape?.()
      },
      handleDragStart: (_: any, data: { x: number; y: number }) => setActualPosition(data),
      handleDrag: (_: any, data: { deltaX: number; deltaY: number }) => {
        setActualPosition((prev) => ({
          x: prev.x + data.deltaX,
          y: prev.y + data.deltaY,
        }))
      },
    }
  }, [latest])

  const escapeCallbackRef = useEscapeCallbackRef(functions.handlePressEscape)

  const layoutEffectRef = useLayoutEffectRef(
    (node: HTMLElement | null) => {
      if (isOpen) {
        const oldDefaultPosition = latest.defaultPosition
        const nextDefaultPosition =
          oldDefaultPosition.top === latest.top &&
          oldDefaultPosition.left === latest.left &&
          oldDefaultPosition.right === latest.right &&
          oldDefaultPosition.bottom === latest.bottom
            ? oldDefaultPosition
            : {
                top: latest.top,
                left: latest.left,
                right: latest.right,
                bottom: latest.bottom,
              }

        setDefaultPosition(nextDefaultPosition)

        // 中央寄せの座標計算を行う
        if (node) {
          const safeAreaInsets = getSafeAreaInsets()
          const isXCenter =
            nextDefaultPosition.left === undefined && nextDefaultPosition.right === undefined
          const isYCenter =
            nextDefaultPosition.top === undefined && nextDefaultPosition.bottom === undefined
          let nextCentering = latest.centering

          if (isXCenter || isYCenter) {
            const rect = node.getBoundingClientRect()
            // HINT: safe areaに重ならない領域の中央に配置する
            const safeHeight = window.innerHeight - safeAreaInsets.top - safeAreaInsets.bottom
            const safeWidth = window.innerWidth - safeAreaInsets.left - safeAreaInsets.right
            const tempCentering = {
              top: isYCenter
                ? safeAreaInsets.top + Math.max(0, safeHeight / 2 - rect.height / 2)
                : undefined,
              left: isXCenter
                ? safeAreaInsets.left + Math.max(0, safeWidth / 2 - rect.width / 2)
                : undefined,
            }

            nextCentering =
              latest.centering.top === tempCentering.top &&
              latest.centering.left === tempCentering.left
                ? latest.centering
                : tempCentering

            setCentering(nextCentering)
          } else if (latest.centering.top !== undefined || latest.centering.left !== undefined) {
            // HINT: 中央寄せが不要になった場合、以前の値が残るとdefaultPositionより優先されてしまう
            nextCentering = {}

            setCentering(nextCentering)
          }

          // HINT: centering.topは0になりうるため、undefinedとの区別が必要。
          // 再表示時は前回のドラッグによる移動量がまだ残っているため、その分を除いた位置を初期位置とする
          const initialTop =
            nextCentering.top !== undefined
              ? nextCentering.top
              : node.getBoundingClientRect().top - latest.position.y
          // HINT: ドラッグでsafe areaに重ならないよう、上端をsafe areaの下端までに制限する。
          // 初期位置がすでにsafe areaに重なっている場合は、ドラッグ開始時に位置が飛ばないよう初期位置を上限にする
          const nextTop = Math.min(0, safeAreaInsets.top - initialTop)

          // HINT: 中央寄せの有無に関わらずdraggableBoundsは更新する必要がある
          setDraggableBounds((current: DraggableBounds | string | false) =>
            typeof current === 'object' && current.top === nextTop ? current : { top: nextTop },
          )

          node
            .querySelector<HTMLElement>('.smarthr-ui-ModelessDialog-firstFocusTarget[tabindex]')
            ?.focus()
        }

        functions.setActualPosition({ x: 0, y: 0 })
      }

      const focusHandler = (e: FocusEvent) => {
        // e.target(現在フォーカスがあたっている要素)がModeless dialog外の要素であれば、lastFocusElementRefに代入する
        if (e.target instanceof HTMLElement && !node?.contains(e.target)) {
          lastFocusElementRef.current = e.target
        }
      }

      document.addEventListener('focus', focusHandler, true)

      return () => {
        functions.cleanupLiveRegion()
        document.removeEventListener('focus', focusHandler, true)
      }
    },
    [isOpen, functions, latest],
  )

  // HINT: escapeCallbackRefはnodeを参照せずEscapeキーの監視を行うだけなので、
  // どの要素にアタッチしても良い。Dialogが表示されている間常にマウントされている
  // wrapperRefに混ぜ込んでいる
  const mergedRef = useMergeRefs(wrapperRef, escapeCallbackRef, layoutEffectRef)

  return createPortal(
    <DialogOverlap as="section" isOpen={isOpen} className={classNames.overlap}>
      <Draggable
        {...Draggable.defaultProps}
        nodeRef={wrapperRef}
        handle=".smarthr-ui-ModelessDialog-handle"
        position={position}
        bounds={draggableBounds ?? false}
        onStart={functions.handleDragStart}
        onDrag={functions.handleDrag}
      >
        <Panel
          {...rest}
          ref={mergedRef}
          role="dialog"
          radius="m"
          layer={3}
          overflow="auto"
          className={classNames.wrapper}
          // HINT: Panelはmemo化されていないため、styleを安定化しても再レンダリングは減らない。
          // 依存する値も多く、memo化の効果が薄いため直接記述している
          style={{
            top: centering.top ?? defaultPosition.top,
            left: centering.left ?? defaultPosition.left,
            right: defaultPosition.right,
            bottom: defaultPosition.bottom,
            width: size ? undefined : width,
            height,
          }}
          aria-labelledby={labelId}
        >
          {/* eslint-disable-next-line smarthr/a11y-scroller-has-tabindex -- dummy element for focus management. */}
          <div tabIndex={-1} className="smarthr-ui-ModelessDialog-firstFocusTarget" />
          <div className={classNames.header}>
            <Handler
              className={classNames.dialogHandler}
              handleArrowKeyDown={functions.handleArrowKeyDown}
            />
            <div id={labelId} className="shr-my-1 shr-me-1 shr-min-w-0">
              {/* eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content */}
              <Heading>{heading}</Heading>
            </div>
            <CloseButton
              // DialogHandlerの上に出すためにスタッキングコンテキストを生成
              className="shr-relative shr-ml-auto shr-shrink-0"
              handleClick={functions.handleClickClose}
            />
          </div>
          <DialogBody
            contentBgColor={contentBgColor}
            contentPadding={contentPadding}
            className="smarthr-ui-ModelessDialog-content shr-overscroll-contain"
          >
            {children}
          </DialogBody>
          {footer && (
            <div className="smarthr-ui-ModelessDialog-footer shr-border-t-shorthand">{footer}</div>
          )}
          <LiveRegion visuallyHidden={true} announceDelay={600}>
            {liveRegionText}
          </LiveRegion>
        </Panel>
      </Draggable>
    </DialogOverlap>,
  )
}

const Handler = memo<{
  className: string
  handleArrowKeyDown: (e: KeyboardEvent) => void
}>(({ handleArrowKeyDown, ...rest }) => {
  const { localize } = useIntl()

  return (
    <>
      <button
        {...rest}
        type="button"
        aria-label={localize({
          id: 'smarthr-ui/ModelessDialog/dialogHandlerAriaLabel',
          defaultText: 'ダイアログの位置',
        })}
        aria-roledescription={localize({
          id: 'smarthr-ui/ModelessDialog/dialogHandlerAriaRoleDescription',
          defaultText: 'ドラッグ可能',
        })}
        aria-describedby="handler-description"
        onKeyDown={handleArrowKeyDown}
      >
        <FaGripIcon />
      </button>
      <div id="handler-description" className="shr-hidden">
        {localize({
          id: 'smarthr-ui/ModelessDialog/dialogHandlerDescription',
          defaultText: '矢印キーを押して上下左右に移動できます',
        })}
      </div>
    </>
  )
})

const CloseButton = memo<{
  className: string
  handleClick: (e: MouseEvent<HTMLButtonElement>) => void
}>(({ handleClick, className }) => (
  <div className={className}>
    <Button
      type="button"
      size="S"
      className="smarthr-ui-ModelessDialog-closeButton"
      onClick={handleClick}
    >
      <FaXmarkIcon
        alt={<Localizer id="smarthr-ui/ModelessDialog/closeButtonIconAlt" defaultText="閉じる" />}
      />
    </Button>
  </div>
))
