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
import { BaseElementProps, DialogBase } from '../Base'
import { SecondaryButton } from '../Button'
import { FaTimesIcon } from '../Icon'
import { DialogTransition } from './DialogTransition'
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
      moveFocusFromTrigger()
    } else {
      returnFocusToTrigger()
    }
  }, [isOpen, moveFocusFromTrigger, returnFocusToTrigger])

  useLayoutEffect(() => {
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

  const labelId = useId()
  const classNames = useClassNames().modelessDialog

  return createPortal(
    <DialogTransition isOpen={isOpen}>
      <Draggable handle={`.${classNames.header}`}>
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
          themes={theme}
          role="dialog"
          aria-labelledby={labelId}
          {...props}
        >
          <Box className={classNames.box}>
            <div tabIndex={-1}>{/* dummy element for focus management. */}</div>
            <Header className={classNames.header} themes={theme}>
              <div id={labelId}>
                {typeof header === 'string' ? <Title themes={theme}>{header}</Title> : header}
              </div>
              <CloseButtonLayout themes={theme}>
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
          </Box>
        </Layout>
      </Draggable>
    </DialogTransition>,
    portalParent,
  )
}

const Layout = styled.div<{ themes: Theme }>`
  ${({ themes: { zIndex } }) => css`
    position: fixed;
    z-index: ${zIndex.OVERLAP};
  `}
`
const Box = styled(DialogBase).attrs({ radius: 'm' })`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-height: 100vh;
`
const Header = styled.div<{ themes: Theme }>`
  ${({ themes: { border } }) => css`
    display: flex;
    align-items: center;
    border-bottom: ${border.shorthand};
    cursor: move;
    user-select: none;
  `}
`
const Title = styled.div<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => css`
    margin: ${spacingByChar(1)};
  `}
`
const CloseButtonLayout = styled.div<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => css`
    flex-shrink: 0;
    margin: ${spacingByChar(1)};
    margin-left: auto;
  `}
`
const Content = styled.div`
  overflow: auto;
`
