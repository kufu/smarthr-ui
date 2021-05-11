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

export const messageTypes = ['success', 'info', 'warning', 'error', ''] as const
export const animationTypes = ['bounce', 'fade', 'none'] as const
export const roles = ['alert', 'status'] as const

export type Props = {
  visible: boolean
  type: typeof messageTypes[number]
  text: string
  animation?: typeof animationTypes[number]
  role?: typeof roles[number]
  className?: string
  onClose: () => void
}

type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

const REMOVE_DELAY = 8000
let timerId: any = 0

export const FlashMessage: VFC<Props & ElementProps> = ({
  visible,
  type,
  text,
  animation = 'bounce',
  role = 'alert',
  className = '',
  onClose,
}) => {
  const theme = useTheme()
  const classNames = useClassNames()

  useEffect(() => {
    if (visible) {
      timerId = setTimeout(onClose, REMOVE_DELAY)
    } else {
      clearTimeout(timerId)
    }

    return () => {
      clearTimeout(timerId)
    }
  }, [onClose, visible])

  if (!visible) return null

  let Icon = FaCheckCircleIcon
  let iconColor = theme.color.TEXT_GREY

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
  }

  return (
    <Wrapper
      className={`${type} ${classNames.wrapper}  ${className}`}
      themes={theme}
      animation={animation}
      role={role}
    >
      <IconWrapper>
        <Icon size={14} color={iconColor} className={classNames.icon} />
      </IconWrapper>
      <Txt themes={theme} className={classNames.text}>
        {text}
      </Txt>
      <SecondaryButton className={`close ${classNames.button}`} onClick={onClose} size="s" square>
        <FaTimesIcon size={16} />
      </SecondaryButton>
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
    const { spacingByChar, radius, color, zIndex } = themes

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
      display: flex;
      position: fixed;
      bottom: ${spacingByChar(0.5)};
      left: ${spacingByChar(0.5)};
      box-sizing: border-box;
      align-items: center;

      /* border + padding + Icon + 10em + Button + margin */
      min-width: calc(2px + ${spacingByChar(1.5)} + 14px + 8em + 27px + ${spacingByChar(1)});
      padding: ${spacingByChar(0.5)} ${spacingByChar(1)};
      padding-right: ${spacingByChar(0.5)};
      background-color: #fff;
      border: 1px solid ${color.BORDER};
      border-radius: ${radius.m};
      box-shadow: 0 4px 10px 0 rgba(51, 51, 51, 0.3);
      animation: ${keyframe} ${animation === 'none' ? '0.01s' : '1s'} 0s both;

      @media (prefers-reduced-motion) {
        animation-duration: 0.01s;
      }

      & > * + * {
        margin-left: ${spacingByChar(0.5)};
      }
    `
  }}
`

const IconWrapper = styled.span`
  flex-shrink: 0;
`

const Txt = styled.p<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, font } = themes.size

    return css`
      flex-grow: 1;
      flex-shrink: 1;
      margin-top: 0;
      margin-bottom: 0;
      padding: 0;
      font-size: ${pxToRem(font.TALL)};
      line-height: 1.5;
    `
  }}
`
