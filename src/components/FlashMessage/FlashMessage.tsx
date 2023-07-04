import React, { FC, HTMLAttributes, ReactNode, useEffect } from 'react'
import styled, { css, keyframes } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { Button } from '../Button'
import { FaTimesIcon } from '../Icon'
import { ResponseMessage } from '../ResponseMessage'

import { useClassNames } from './useClassNames'

export const messageTypes = ['success', 'info', 'warning', 'error'] as const
export const animationTypes = ['bounce', 'fade', 'none'] as const
export const roles = ['alert', 'status'] as const

export type Props = {
  /** true のときに FlashMessage を表示する */
  visible: boolean
  /** 表示するアイコンのタイプ */
  type: (typeof messageTypes)[number]
  /** メッセージの内容 */
  text: ReactNode
  /** アニメーションのタイプ */
  animation?: (typeof animationTypes)[number]
  /** コンポーネントに適用する role 属性 */
  role?: (typeof roles)[number]
  /** コンポーネントに適用するクラス名 */
  className?: string
  /** 閉じるボタンを押下、または表示してから8秒後に発火するコールバック関数 */
  onClose: () => void
  /** FlashMessage が表示されてから一定時間後に自動で閉じるかどうか */
  autoClose?: boolean
}

type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

const REMOVE_DELAY = 8000

/**
 * @deprecated `FlashMessage` は気づきにくいため、安易な使用はお勧めしません。`NotificationBar` や `Dialog` の使用を検討してください。
 */
export const FlashMessage: FC<Props & ElementProps> = ({
  visible,
  type,
  text,
  animation = 'bounce',
  role = 'alert',
  className = '',
  onClose,
  autoClose = true,
  ...props
}) => {
  const theme = useTheme()
  const classNames = useClassNames()

  useEffect(() => {
    if (!visible || !autoClose) {
      return
    }
    const timerId = setTimeout(onClose, REMOVE_DELAY)

    return () => {
      clearTimeout(timerId)
    }
  }, [autoClose, onClose, visible])

  if (!visible) return null

  return (
    <Wrapper
      {...props}
      className={`${type} ${classNames.wrapper}  ${className}`}
      themes={theme}
      animation={animation}
      role={role}
    >
      <ResponseMessage type={type} iconGap={0.5} className={classNames.icon}>
        {text}
      </ResponseMessage>
      <CloseButton
        themes={theme}
        className={`close ${classNames.button}`}
        onClick={onClose}
        size="s"
        square
      >
        <FaTimesIcon alt="閉じる" />
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
    const { border, fontSize, space, radius, color, zIndex, shadow } = themes

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
      bottom: ${space(0.5)};
      left: ${space(0.5)};

      display: flex;
      align-items: center;
      gap: ${space(0.5)};

      box-shadow: ${shadow.LAYER4};
      border: ${border.shorthand};
      border-radius: ${radius.m};
      background-color: ${color.WHITE};
      padding: ${space(1)};

      /* Icon + margin + 8文字 + margin + Button(border + padding + fontSize) */
      min-width: calc(
        1em + ${space(0.5)} + 8em + ${space(0.5)} + (${border.lineWidth} * 2) + (${space(0.5)} * 2) +
          ${fontSize.S}
      );
      animation: ${keyframe} ${animation === 'none' ? '0.01s' : '1s'} 0s both;

      @media (prefers-reduced-motion) {
        animation-duration: 0.01s;
      }

      .smarthr-ui-Icon-withText {
        flex-grow: 1;

        margin-block: ${space(-0.25)};
      }
    `
  }}
`

const CloseButton = styled(Button)<{ themes: Theme }>(
  ({ themes: { space } }) => css`
    margin-block: ${space(-0.5)};
    margin-inline-end: ${space(-0.5)};
  `,
)
