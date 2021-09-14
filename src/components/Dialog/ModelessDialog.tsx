import React, {
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import styled, { css } from 'styled-components'
import Draggable from 'react-draggable'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useId } from '../../hooks/useId'
import { useHandleEscape } from '../../hooks/useHandleEscape'
import { Base, BaseElementProps } from '../Base'
import { SecondaryButton } from '../Button'
import { FaTimesIcon } from '../Icon'
import { DialogOverlap } from './DialogOverlap'
import { useTriggerFocusControl } from './FocusTrap'
import { useClassNames } from './useClassNames'

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
}

export const ModelessDialog: React.VFC<Props & BaseElementProps> = ({
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
  className = '',
  ...props
}) => {
  const portalParent = useRef(document.createElement('div')).current
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [centering, setCentering] = useState<{
    top?: number
    left?: number
  }>({})
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })
  const theme = useTheme()

  useEffect(() => {
    document.body.appendChild(portalParent)
    return () => {
      document.body.removeChild(portalParent)
    }
  }, [portalParent])

  useHandleEscape(
    useCallback(() => {
      if (isOpen) {
        onPressEscape && onPressEscape()
      }
    }, [isOpen, onPressEscape]),
  )

  const { moveFocusFromTrigger, returnFocusToTrigger } = useTriggerFocusControl(wrapperRef)
  useLayoutEffect(() => {
    if (isOpen) {
      setPosition({ x: 0, y: 0 })
      moveFocusFromTrigger()
    } else {
      returnFocusToTrigger()
    }
  }, [isOpen, moveFocusFromTrigger, returnFocusToTrigger])

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

  const labelId = useId()
  const classNames = useClassNames().modelessDialog

  return createPortal(
    <DialogOverlap isOpen={isOpen}>
      <Draggable
        handle={`.${classNames.header}`}
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
      >
        <Layout
          className={`${className} ${classNames.wrapper}`}
          style={{
            top: centering.top !== undefined ? centering.top : top,
            left: centering.left !== undefined ? centering.left : left,
            right,
            bottom,
            width,
            height,
          }}
          ref={wrapperRef}
          role="dialog"
          aria-labelledby={labelId}
          {...props}
        >
          <Box className={classNames.box}>
            <div tabIndex={-1}>{/* dummy element for focus management. */}</div>
            <Header
              className={classNames.header}
              tabIndex={0}
              onKeyDown={handleArrowKey}
              aria-label="ドラッグまたは矢印キーでダイアログを移動させることができます"
              themes={theme}
            >
              <Title id={labelId} themes={theme}>
                {header}
              </Title>
              <CloseButtonLayout>
                <SecondaryButton
                  type="button"
                  size="s"
                  square
                  onClick={onClickClose}
                  className={classNames.closeButton}
                >
                  <FaTimesIcon size={13} visuallyHiddenText="閉じる" />
                </SecondaryButton>
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
    portalParent,
  )
}

const Layout = styled.div`
  position: fixed;
`
const Box = styled(Base).attrs({ radius: 'm', layer: 3 })`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-height: 100vh;
`
const Header = styled.div<{ themes: Theme }>`
  ${({ themes: { border, spacingByChar } }) => css`
    display: flex;
    align-items: center;
    padding: ${spacingByChar(1)} ${spacingByChar(1)} ${spacingByChar(1)} ${spacingByChar(1.5)};
    border-bottom: ${border.shorthand};
    cursor: move;
  `}
`
const Title = styled.div<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => css`
    margin-right: ${spacingByChar(1)};
  `}
`
const CloseButtonLayout = styled.div`
  flex-shrink: 0;
  margin-left: auto;
`
const Content = styled.div`
  overflow: auto;
`
const Footer = styled.div<{ themes: Theme }>`
  ${({ themes: { border } }) => css`
    border-top: ${border.shorthand};
  `}
`
