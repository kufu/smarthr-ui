import React, { HTMLAttributes, ReactNode, RefObject, VFC, useCallback, useRef } from 'react'
import styled, { css } from 'styled-components'

import { useHandleEscape } from '../../hooks/useHandleEscape'
import { Theme, useTheme } from '../../hooks/useTheme'

import { BodyScrollSuppressor } from './BodyScrollSuppressor'
import { DialogOverlap } from './DialogOverlap'
import { DialogPositionProvider } from './DialogPositionProvider'
import { FocusTrap } from './FocusTrap'
import { useClassNames } from './useClassNames'

export type DialogContentInnerProps = {
  /**
   * オーバーレイをクリックした時に発火するコールバック関数
   */
  onClickOverlay?: () => void
  /**
   * エスケープキーを押下した時に発火するコールバック関数
   */
  onPressEscape?: () => void
  /**
   * ダイアログを開いているかどうか
   */
  isOpen: boolean
  /**
   * ダイアログの幅
   */
  width?: string | number
  /**
   * ダイアログを開いたときの初期 top 位置
   */
  top?: number
  /**
   * ダイアログを開いたときの初期 right 位置
   */
  right?: number
  /**
   * ダイアログを開いたときの初期 bottom 位置
   */
  bottom?: number
  /**
   * ダイアログを開いたときの初期 left 位置
   */
  left?: number
  /**
   * ダイアログの `id`
   */
  id?: string
  /**
   * ダイアログを開いた時にフォーカスする対象
   */
  firstFocusTarget?: RefObject<HTMLElement>
  /**
   * ダイアログの `aria-label`
   */
  ariaLabel?: string
  /**
   * ダイアログの `aria-labelledby`
   */
  ariaLabelledby?: string
  /**
   * コンポーネントに適用するクラス名
   */
  className?: string
  /**
   * ダイアログの内容
   */
  children: ReactNode
}
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof DialogContentInnerProps>

type StyleProps = {
  $width?: string | number
  top?: number
  right?: number
  bottom?: number
  left?: number
}

function exist(value: any) {
  return value !== undefined && value !== null
}

export const DialogContentInner: VFC<DialogContentInnerProps & ElementProps> = ({
  onClickOverlay,
  onPressEscape = () => {
    /* noop */
  },
  isOpen,
  id,
  width,
  firstFocusTarget,
  ariaLabel,
  ariaLabelledby,
  children,
  className = '',
  ...props
}) => {
  const classNames = useClassNames().dialog
  const theme = useTheme()
  const innerRef = useRef<HTMLDivElement>(null)
  useHandleEscape(
    useCallback(() => {
      if (!isOpen) {
        return
      }
      onPressEscape()
    }, [isOpen, onPressEscape]),
  )

  const handleClickOverlay = useCallback(() => {
    if (!isOpen) {
      return
    }
    onClickOverlay && onClickOverlay()
  }, [isOpen, onClickOverlay])

  return (
    <DialogPositionProvider top={props.top} bottom={props.bottom}>
      <DialogOverlap isOpen={isOpen}>
        <Layout className={classNames.wrapper} id={id}>
          <Background
            onClick={handleClickOverlay}
            themes={theme}
            className={classNames.background}
          />
          <Inner
            {...props}
            $width={width}
            ref={innerRef}
            themes={theme}
            role="dialog"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            aria-modal="true"
            className={`${className} ${classNames.dialog}`}
          >
            <FocusTrap firstFocusTarget={firstFocusTarget}>{children}</FocusTrap>
          </Inner>
          {/* Suppresses scrolling of body while modal is displayed */}
          <BodyScrollSuppressor />
        </Layout>
      </DialogOverlap>
    </DialogPositionProvider>
  )
}

const Layout = styled.div`
  position: fixed;
  inset: 0;
`
const Inner = styled.div<StyleProps & { themes: Theme }>`
  ${({ themes, $width, top, right, bottom, left }) => {
    const { border, color, radius, shadow, space } = themes
    const positionRight = exist(right) ? `${right}px` : 'auto'
    const positionBottom = exist(bottom) ? `${bottom}px` : 'auto'
    const positionTop = exist(top) ? `${top}px` : 'auto'
    const positionLeft = exist(left) ? `${left}px` : 'auto'
    const translateX = exist(right) || exist(left) ? '0' : 'calc((100vw - 100%) / 2)'
    const translateY = exist(top) || exist(bottom) ? '0' : 'calc((100vh - 100%) / 2)'

    const minimumMaxWidth = `calc(100vw - max(${left || 0}px, ${space(0.5)}) - max(${
      right || 0
    }px, ${space(0.5)}))`

    return css`
      position: absolute;
      inset: ${positionTop} ${positionRight} ${positionBottom} ${positionLeft};
      ${exist($width) &&
      css`
        width: ${typeof $width === 'number' ? `${$width}px` : $width};
      `}
      /* viewport を超えないように上限設定 */
      max-width:
        ${exist($width)
        ? `min(${minimumMaxWidth}, ${typeof $width === 'number' ? `${$width}px` : $width})`
        : minimumMaxWidth};
      border-radius: ${radius.m};
      background-color: ${color.WHITE};
      box-shadow: ${shadow.LAYER3};
      transform: translate(${translateX}, ${translateY});

      @media (prefers-contrast: more) {
        & {
          border: ${border.highContrast};
        }
      }
    `
  }}
`
const Background = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    return css`
      position: fixed;
      inset: 0;
      background-color: ${themes.color.SCRIM};
    `
  }}
`
