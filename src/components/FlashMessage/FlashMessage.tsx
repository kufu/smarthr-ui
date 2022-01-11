import React, { HTMLAttributes, VFC, useEffect } from 'react'
import styled, { css, keyframes } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

import {
  FaCheckCircleIcon,
  FaExclamationCircleIcon,
  FaExclamationTriangleIcon,
  FaInfoCircleIcon,
  FaTimesIcon,
} from '../Icon'
import { SecondaryButton } from '../Button'

export const messageTypes = ['success', 'info', 'warning', 'error'] as const
export const animationTypes = ['bounce', 'fade', 'none'] as const
export const roles = ['alert', 'status'] as const

export type Props = {
  /** true のときに FlashMessage を表示する */
  visible: boolean
  /** 表示するアイコンのタイプ */
  type: typeof messageTypes[number]
  /** メッセージの内容 */
  text: string
  /** アニメーションのタイプ */
  animation?: typeof animationTypes[number]
  /** コンポーネントに適用する role 属性 */
  role?: typeof roles[number]
  /** コンポーネントに適用するクラス名 */
  className?: string
  /** 閉じるボタンを押下、または表示してから8秒後に発火するコールバック関数 */
  onClose: () => void
}

type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

const REMOVE_DELAY = 8000

export const FlashMessage: VFC<Props & ElementProps> = ({
  visible,
  type,
  text,
  animation = 'bounce',
  role = 'alert',
  className = '',
  onClose,
  ...props
}) => {
  const theme = useTheme()
  const classNames = useClassNames()

  useEffect(() => {
    if (!visible) {
      return
    }
    const timerId = setTimeout(onClose, REMOVE_DELAY)

    return () => {
      clearTimeout(timerId)
    }
  }, [onClose, visible])

  if (!visible) return null

  let Icon
  let iconColor

  switch (type) {
    case 'success':
      Icon = FaCheckCircleIcon
      iconColor = theme.color.MAIN
      break
    case 'info':
      Icon = FaInfoCircleIcon
      iconColor = theme.color.TEXT_GREY
      break
    case 'warning':
      Icon = FaExclamationTriangleIcon
      iconColor = theme.color.WARNING
      break
    case 'error':
      Icon = FaExclamationCircleIcon
      iconColor = theme.color.DANGER
      break
  }

  return (
    <Wrapper
      {...props}
      className={`${type} ${classNames.wrapper}  ${className}`}
      themes={theme}
      animation={animation}
      role={role}
    >
      <IconWrapper>
        <Icon color={iconColor} className={classNames.icon} />
      </IconWrapper>
      <Txt themes={theme} className={classNames.text}>
        {text}
      </Txt>
      <CloseButton
        themes={theme}
        className={`close ${classNames.button}`}
        onClick={onClose}
        size="s"
        square
      >
        <FaTimesIcon visuallyHiddenText="閉じる" />
      </CloseButton>
    </Wrapper>
  )
}

const bounceAnimation = keyframes`
  from,
  20%,
  53%,
  80%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: translate3d(0, 0, 0);
  }
  40%,
  43% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -30px, 0);
  }
  70% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
`

const fadeAnimation = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`

const Wrapper = styled.div<{ themes: Theme; animation: Props['animation'] }>`
  ${({ themes, animation }) => {
    const { border, fontSize, spacingByChar, radius, color, zIndex, shadow } = themes

    let keyframe = bounceAnimation
    switch (animation) {
      case 'bounce':
        keyframe = bounceAnimation
        break
      case 'fade':
        keyframe = fadeAnimation
        break
      case 'none':
        keyframe = fadeAnimation
        break
    }

    return css`
      z-index: ${zIndex.FLASH_MESSAGE};
      position: fixed;
      bottom: ${spacingByChar(0.5)};
      left: ${spacingByChar(0.5)};

      display: flex;
      align-items: center;
      gap: ${spacingByChar(0.5)};

      box-shadow: ${shadow.LAYER4};
      border: ${border.shorthand};
      border-radius: ${radius.m};
      background-color: ${color.WHITE};
      padding: ${spacingByChar(1)};

      /* Icon + margin + 8文字 + margin + Button(border + padding + fontSize) */
      min-width: calc(
        1em + ${spacingByChar(0.5)} + 8em + ${spacingByChar(0.5)} + (${border.lineWidth} * 2) +
          (${spacingByChar(0.5)} * 2) + ${fontSize.S}
      );
      animation: ${keyframe} ${animation === 'none' ? '0.01s' : '1s'} 0s both;

      @media (prefers-reduced-motion) {
        animation-duration: 0.01s;
      }
    `
  }}
`
const IconWrapper = styled.span`
  flex-shrink: 0;

  svg {
    display: block;
  }
`
const Txt = styled.p<{ themes: Theme }>`
  ${({ themes: { fontSize, leading } }) => {
    return css`
      flex-grow: 1;
      flex-shrink: 1;

      /* line-height 分 padding が広がってしまうのを調整 */
      margin-top: calc(((${fontSize.M} * ${leading.NORMAL}) - ${fontSize.M}) / -2);
      margin-bottom: calc(((${fontSize.M} * ${leading.NORMAL}) - ${fontSize.M}) / -2);
      padding: 0;
      font-size: ${fontSize.M};
      line-height: ${leading.NORMAL};
    `
  }}
`
const CloseButton = styled(SecondaryButton)<{ themes: Theme }>(
  ({ themes: { spacingByChar } }) => css`
    margin-top: ${spacingByChar(-0.5)};
    margin-right: ${spacingByChar(-0.5)};
    margin-bottom: ${spacingByChar(-0.5)};
  `,
)
