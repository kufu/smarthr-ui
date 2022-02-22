import React, { HTMLAttributes, ReactNode, VFC, useCallback, useRef } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useHandleEscape } from '../../hooks/useHandleEscape'
import { DialogPositionProvider } from './DialogPositionProvider'
import { FocusTrap } from './FocusTrap'
import { useClassNames } from './useClassNames'
import { BodyScrollSuppressor } from './BodyScrollSuppressor'
import { DialogOverlap } from './DialogOverlap'

export type DialogContentInnerProps = {
  /**
   * Handler function when clicking on onverlay.
   */
  onClickOverlay?: () => void
  /**
   * Handler function when pressing escape key.
   */
  onPressEscape?: () => void
  /**
   * Whether to display a Dialog.
   */
  isOpen: boolean
  /**
   * ダイアログの幅
   */
  width?: string | number
  /**
   * Specifies the top position of the Dialog content.
   */
  top?: number
  /**
   * Specifies the right position of the Dialog content.
   */
  right?: number
  /**
   * Specifies the bottom position of the Dialog content.
   */
  bottom?: number
  /**
   * Specifies the left position of the Dialog content.
   */
  left?: number
  /**
   * `id` of the component.
   */
  id?: string
  /**
   * `aria-label` of the component.
   */
  ariaLabel?: string
  /**
   * `aria-labelledby` of the component.
   */
  ariaLabelledby?: string
  /**
   * `className` of the component.
   */
  className?: string
  /**
   * The content of the component.
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
  ariaLabel,
  ariaLabelledby,
  children,
  className = '',
  ...props
}) => {
  const classNames = useClassNames().dialog
  const theme = useTheme()
  const innerRef = useRef<HTMLDivElement>(null)
  const focusTarget = useRef<HTMLDivElement>(null)
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
          <FocusTrap>
            <Inner
              $width={width}
              ref={innerRef}
              themes={theme}
              role="dialog"
              aria-label={ariaLabel}
              aria-labelledby={ariaLabelledby}
              aria-modal="true"
              className={`${className} ${classNames.dialog}`}
              {...props}
            >
              {/* dummy element for focus management. */}
              <div ref={focusTarget} tabIndex={-1} aria-label={ariaLabel}></div>
              {children}
            </Inner>
          </FocusTrap>
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
        `

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
