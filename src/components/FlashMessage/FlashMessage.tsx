import React, { FC, useEffect } from 'react'
import styled, { css, keyframes } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

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
  className?: string
  animation?: typeof animationTypes[number]
  role?: typeof roles[number]
  onClose: () => void
}

const REMOVE_DELAY = 8000
let timerId: any = 0

export const FlashMessage: FC<Props> = ({
  animation = 'bounce',
  visible,
  type,
  text,
  onClose,
  className = '',
  role = 'alert',
}) => {
  const theme = useTheme()

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
    <Wrapper className={`${type} ${className}`} themes={theme} animation={animation} role={role}>
      <Icon size={14} color={iconColor} />
      <Txt themes={theme}>{text}</Txt>
      <CloseButton className="close" onClick={onClose} size="s" square themes={theme}>
        <FaTimesIcon size={16} />
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
    const { size, spacing, radius, color, zIndex } = themes

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
      bottom: ${size.pxToRem(spacing.XXS)};
      left: ${size.pxToRem(spacing.XXS)};
      box-sizing: border-box;
      align-items: center;
      min-width: ${size.pxToRem(200)};
      padding: ${size.pxToRem(spacing.XS)};
      padding-right: ${size.pxToRem(54)};
      background-color: #fff;
      border: 1px solid ${color.BORDER};
      border-radius: ${radius.m};
      box-shadow: 0 4px 10px 0 rgba(51, 51, 51, 0.3);
      animation: ${keyframe} ${animation === 'none' ? '0.01s' : '1s'} 0s both;

      @media (prefers-reduced-motion) {
        animation-duration: 0.01s;
      }
    `
  }}
`
const CloseButton = styled(SecondaryButton)<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space } = themes.size

    return css`
      position: absolute;
      top: 50%;
      right: ${pxToRem(space.XXS)};
      transform: translateY(-50%);
    `
  }}
`
const Txt = styled.p<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space, font } = themes.size

    return css`
      flex-grow: 1;
      flex-shrink: 1;
      padding: 0;
      margin: 0 0 0 ${pxToRem(space.XXS)};
      font-size: ${pxToRem(font.TALL)};
      line-height: 1;
    `
  }}
`
