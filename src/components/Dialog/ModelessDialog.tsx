import React, { MouseEvent, ReactNode, useCallback, useEffect, useMemo, useRef } from 'react'
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
  top?: string
  /**
   * ダイアログを開いたときの初期 left 位置
   */
  left?: string
  /**
   * ダイアログを開いたときの初期 right 位置
   */
  right?: string
  /**
   * ダイアログを開いたときの初期 bottom 位置
   */
  bottom?: string
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
  useEffect(() => {
    if (isOpen) {
      moveFocusFromTrigger()
    } else {
      returnFocusToTrigger()
    }
  }, [isOpen, moveFocusFromTrigger, returnFocusToTrigger])

  const positionProps = useMemo(() => {
    const isXCenter = left === undefined && right === undefined
    const isYCenter = top === undefined && bottom === undefined
    return {
      rect: {
        top: isYCenter ? '50%' : top,
        left: isXCenter ? '50%' : left,
        right,
        bottom,
        width,
        height,
      },
      offset: {
        x: isXCenter ? '-50%' : 0,
        y: isYCenter ? '-50%' : 0,
      },
    }
  }, [bottom, height, left, right, top, width])

  const labelId = useId()
  const classNames = useClassNames().modelessDialog

  return createPortal(
    <DialogTransition isOpen={isOpen}>
      <Draggable handle={`.${classNames.header}`} positionOffset={positionProps.offset}>
        <Fixed
          className={`${className} ${classNames.wrapper}`}
          style={positionProps.rect}
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
        </Fixed>
      </Draggable>
    </DialogTransition>,
    portalParent,
  )
}

const Fixed = styled.div<{ themes: Theme }>`
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
