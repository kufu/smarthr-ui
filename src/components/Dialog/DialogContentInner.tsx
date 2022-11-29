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
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`
const Inner = styled.div<StyleProps & { themes: Theme }>`
  ${({ themes, $width, top, right, bottom, left }) => {
    const { color, radius, shadow, spacingByChar } = themes
    const positionRight = exist(right) ? `${right}px` : 'auto'
    const positionBottom = exist(bottom) ? `${bottom}px` : 'auto'
    const positionTop = exist(top) ? `${top}px` : 'auto'
    const positionLeft = exist(left) ? `${left}px` : 'auto'
    const translateX = exist(right) || exist(left) ? '0' : 'calc((100vw - 100%) / 2)'
    const translateY = exist(top) || exist(bottom) ? '0' : 'calc((100vh - 100%) / 2)'

    const widthStyles = exist($width)
      ? // width が指定されているときは width 設定
        css`
          width: ${typeof $width === 'number' ? `${$width}px` : $width};
        `
      : exist(left) && exist(right)
      ? // left, right が両方指定されているときは、それに任せる
        null
      : // 幅を確定できる指定がされていない場合は、viewport を超えないように上限設定
        css`
          max-width: min(
            calc(
              100vw - max(${left || 0}px, ${spacingByChar(0.5)}) -
                max(${right || 0}px, ${spacingByChar(0.5)})
            ),
            800px
          );
        ` /* TODO: 幅の定数指定は、トークンが決まり theme に入ったら差し替える */

    return css`
      position: absolute;
      top: ${positionTop};
      right: ${positionRight};
      bottom: ${positionBottom};
      left: ${positionLeft};
      ${widthStyles};
      border-radius: ${radius.m};
      background-color: ${color.WHITE};
      box-shadow: ${shadow.LAYER3};
      transform: translate(${translateX}, ${translateY});
    `
  }}
`
const Background = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    return css`
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: ${themes.color.SCRIM};
    `
  }}
`
