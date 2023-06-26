import React, {
  ComponentProps,
  FC,
  MouseEvent,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import Draggable from 'react-draggable'
import styled, { css } from 'styled-components'

import { useHandleEscape } from '../../hooks/useHandleEscape'
import { useId } from '../../hooks/useId'
import { Theme, useTheme } from '../../hooks/useTheme'
import { Base, BaseElementProps } from '../Base'
import { Button } from '../Button'
import { FaGripHorizontalIcon, FaTimesIcon } from '../Icon'

import { DialogOverlap } from './DialogOverlap'
import { useClassNames } from './useClassNames'
import { useDialogPortal } from './useDialogPortal'

import type { DecoratorsType } from '../../types'

type Props = {
  /**
   * ダイアログのヘッダ部分の内容
   */
  header: ReactNode
  /**
   * ダイアログのコンテンツ部分の内容
   */
  children: ReactNode
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
}

const DIALOG_HANDLER_ARIA_LABEL = 'ダイアログの位置'
const CLOSE_BUTTON_ICON_ALT = '閉じる'

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
  className = '',
  decorators,
  id,
  ...props
}) => {
  const labelId = useId()
  const classNames = useClassNames().modelessDialog
  const { createPortal } = useDialogPortal(portalParent, id)
  const theme = useTheme()

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
        handle={`.${classNames.handle}`}
        onStart={(_, data) => setPosition({ x: data.x, y: data.y })}
        onDrag={(_, data) => {
          setPosition((prev) => {
            return {
              x: prev.x + data.deltaX,
              y: prev.y + data.deltaY,
            }
          })
        }}
        position={position}
        bounds={draggableBounds}
      >
        <Layout
          {...props}
          className={`${className} ${classNames.wrapper}`}
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
          <Box
            isWidthAuto={width === undefined}
            left={left}
            right={right}
            themes={theme}
            className={classNames.box}
          >
            <div tabIndex={-1} ref={focusTargetRef}>
              {/* dummy element for focus management. */}
            </div>
            <Header className={classNames.header} themes={theme}>
              <DialogHandler
                className={classNames.handle}
                themes={theme}
                tabIndex={0}
                role="slider"
                aria-label={dialogHandlerAriaLabel}
                aria-valuetext={dialogHandlerAriaValuetext}
                onKeyDown={handleArrowKey}
              >
                <FaGripHorizontalIcon />
              </DialogHandler>
              <Title id={labelId} themes={theme}>
                {header}
              </Title>
              <CloseButtonLayout>
                <Button
                  type="button"
                  size="s"
                  square
                  onClick={onClickClose}
                  className={classNames.closeButton}
                >
                  <FaTimesIcon alt={closeButtonIconAlt} />
                </Button>
              </CloseButtonLayout>
            </Header>
            <Content className={classNames.content}>{children}</Content>
            {footer && (
              <Footer className={classNames.footer} themes={theme}>
                {footer}
              </Footer>
            )}
          </Box>
        </Layout>
      </Draggable>
    </DialogOverlap>,
  )
}

const Layout = styled.div`
  position: fixed;
`
const Box = styled(Base).attrs({ radius: 'm', layer: 3 })<{
  isWidthAuto: boolean
  left?: string | number
  right?: string | number
  themes: Theme
}>`
  ${({ isWidthAuto, left = 0, right = 0, themes: { spacingByChar } }) => {
    const leftMargin = typeof left === 'number' ? `${left}px` : left
    const rightMargin = typeof right === 'number' ? `${right}px` : right

    return css`
      display: flex;
      flex-direction: column;
      ${
        isWidthAuto &&
        css`
          max-width: min(
            calc(
              100vw - max(${leftMargin}, ${spacingByChar(0.5)}) -
                max(${rightMargin}, ${spacingByChar(0.5)})
            ),
            800px
          );
        ` /* TODO: 幅の定数指定は、トークンが決まり theme に入ったら差し替える */
      }
      height: 100%;
      max-height: 100vh;
    `
  }}
`
const Header = styled.div<{ themes: Theme }>`
  ${({ themes: { color, border, spacingByChar } }) => css`
    position: relative;
    display: flex;
    align-items: center;
    padding-left: ${spacingByChar(1.5)};
    padding-right: ${spacingByChar(1)};
    border-bottom: ${border.shorthand};
    cursor: move;

    &:hover {
      background-color: ${color.hoverColor(color.WHITE)};
    }
  `}
`
const Title = styled.div<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => css`
    /* DialogHandlerの上に出すためにスタッキングコンテキストを生成 */
    position: relative;
    margin: ${spacingByChar(1)} ${spacingByChar(1)} ${spacingByChar(1)} 0;
  `}
`

const DialogHandler = styled.div<{ themes: Theme }>`
  ${({ themes: { color, shadow, radius } }) => css`
    position: absolute;
    inset: 2px 0 0;
    margin: auto;
    border-top-right-radius: ${radius.s};
    border-top-left-radius: ${radius.s};
    color: ${color.TEXT_GREY};
    display: flex;
    justify-content: center;
    transition: color 0.1s ease;

    &:focus-visible {
      outline: none;
      box-shadow: ${shadow.OUTLINE};
      background-color: ${color.hoverColor(color.WHITE)};
    }
  `}
`

const CloseButtonLayout = styled.div`
  /* DialogHandlerの上に出すためにスタッキングコンテキストを生成 */
  position: relative;
  flex-shrink: 0;
  margin-left: auto;
`
const Content = styled.div`
  flex: 1;
  overflow: auto;
  overscroll-behavior: contain;
`
const Footer = styled.div<{ themes: Theme }>`
  ${({ themes: { border } }) => css`
    border-top: ${border.shorthand};
  `}
`
