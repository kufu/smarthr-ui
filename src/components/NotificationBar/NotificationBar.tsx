import React, { ComponentProps, ComponentPropsWithoutRef, PropsWithChildren, useMemo } from 'react'
import styled, { css, keyframes } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { Base as shrBase } from '../Base'
import { Button } from '../Button'
import {
  FaCheckCircleIcon,
  FaExclamationCircleIcon,
  FaExclamationTriangleIcon,
  FaInfoCircleIcon,
  FaTimesIcon,
  WarningIcon,
} from '../Icon'
import { Cluster } from '../Layout'
import { Text } from '../Text'

import { useClassNames } from './useClassNames'

export const messageTypes = ['info', 'success', 'error', 'warning'] as const

type Props = PropsWithChildren<{
  /** メッセージの種類 */
  type: (typeof messageTypes)[number]
  /** 強調するかどうか */
  bold?: boolean
  /** スライドインするかどうか */
  animate?: boolean
  /** メッセージ */
  message: React.ReactNode
  /** 閉じるボタン押下時に発火させる関数 */
  onClose?: () => void
  /** role 属性 */
  role?: 'alert' | 'status'
  /** 下地 */
  base?: 'none' | 'base'
}>
type ElementProps = Omit<ComponentPropsWithoutRef<'div'>, keyof Props>
type BaseProps = Pick<ComponentProps<typeof shrBase>, 'radius' | 'layer'>

export const NotificationBar: React.FC<Props & ElementProps & BaseProps> = ({
  type,
  bold = false,
  message,
  onClose,
  children,
  role = type === 'info' ? 'status' : 'alert',
  base = 'none',
  radius,
  layer,
  className = '',
  ...props
}) => {
  const theme = useTheme()
  const { color } = theme
  const classNames = useClassNames()

  const { Icon, iconColor, ...colorSet } = useMemo(() => {
    switch (type) {
      case 'info':
        return {
          Icon: FaInfoCircleIcon,
          iconColor: color.TEXT_GREY,
        }
      case 'success': {
        const colors = bold
          ? {
              iconColor: color.TEXT_WHITE,
              fgColor: color.TEXT_WHITE,
              bgColor: color.MAIN,
            }
          : {}
        return {
          Icon: FaCheckCircleIcon,
          iconColor: color.MAIN,
          ...colors,
        }
      }
      case 'warning': {
        const colors = bold
          ? {
              Icon: FaExclamationTriangleIcon,
              fgColor: color.TEXT_BLACK,
              bgColor: color.WARNING_YELLOW,
            }
          : {}
        return {
          Icon: WarningIcon,
          iconColor: color.TEXT_BLACK,
          ...colors,
        }
      }
      case 'error': {
        const colors = bold
          ? {
              iconColor: color.TEXT_WHITE,
              fgColor: color.TEXT_WHITE,
              bgColor: color.DANGER,
            }
          : {}
        return {
          Icon: FaExclamationCircleIcon,
          iconColor: color.DANGER,
          ...colors,
        }
      }
    }
  }, [color, type, bold])

  const { baseComponent: WrapBase, baseProps } = useMemo(
    () =>
      base === 'base'
        ? {
            baseComponent: Base,
            baseProps: {
              radius,
              layer,
            },
          }
        : {
            baseComponent: React.Fragment,
            baseProps: {},
          },
    [base, layer, radius],
  )

  return (
    <WrapBase {...baseProps}>
      <Wrapper
        {...props}
        className={`${type} ${classNames.wrapper}${className && ` ${className}`}`}
        role={role}
        themes={theme}
        colorSet={colorSet}
      >
        <MessageArea themes={theme} className={classNames.messageArea}>
          <IconLayout>
            <Icon color={iconColor} />
          </IconLayout>
          <StyledText leading="TIGHT">{message}</StyledText>
        </MessageArea>
        <ActionArea themes={theme} className={classNames.actionArea}>
          {children && (
            <ActionWrapper
              themes={theme}
              className={classNames.actions}
              align="center"
              justify="flex-end"
            >
              {children}
            </ActionWrapper>
          )}
          {onClose && (
            <CloseButton
              variant="text"
              colorSet={colorSet}
              themes={theme}
              onClick={onClose}
              className={classNames.closeButton}
              size="s"
            >
              <FaTimesIcon alt="閉じる" />
            </CloseButton>
          )}
        </ActionArea>
      </Wrapper>
    </WrapBase>
  )
}

const Base = styled(shrBase).attrs({ overflow: 'hidden' })``

const Wrapper = styled.div<{
  themes: Theme
  colorSet: { fgColor?: string; bgColor?: string }
  animate?: boolean
}>(
  ({
    themes: { color, fontSize, leading, space },
    colorSet: { fgColor = color.TEXT_BLACK, bgColor = color.WHITE },
    animate,
  }) => css`
    display: flex;
    gap: ${space(1)};
    align-items: center;
    background-color: ${bgColor};
    padding: ${space(0.75)};
    color: ${fgColor};
    ${animate &&
    css`
      /* 1行の場合の高さ分だけスライドさせる */
      /* stylelint-disable-next-line */
      animation: ${slideIn(`calc(${fontSize.M} * ${leading.TIGHT} + ${space(1.5)})`)} 0.2s ease-out;
    `}
  `,
)
const slideIn = (translateLength: string) => keyframes`
  from {
    opacity: 0;
    transform: translateY(calc(-1 * ${translateLength}));
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`
const MessageArea = styled.div<{
  themes: Theme
}>(
  ({ themes: { spacingByChar } }) => css`
    display: flex;
    gap: ${spacingByChar(0.5)};
    align-items: center;
    flex-grow: 1;

    /* flexbox で ellipsis するために min-width をつけて幅の計算を発生させている */
    min-width: 0;
  `,
)
const IconLayout = styled.div`
  /* 子のアイコンの line-height を打ち消すために指定 */
  display: flex;
`
const StyledText = styled(Text)`
  /* flexbox で ellipsis するために min-width をつけて幅の計算を発生させている */
  min-width: 0;
`
const ActionArea = styled.div<{
  themes: Theme
}>(
  ({ themes: { spacingByChar } }) => css`
    display: flex;
    gap: ${spacingByChar(0.5)};
    align-items: center;
    flex-shrink: 0;
  `,
)
const ActionWrapper = styled(Cluster)<{
  themes: Theme
}>(
  ({ themes: { spacingByChar } }) => css`
    margin-top: ${spacingByChar(-0.5)};
    margin-bottom: ${spacingByChar(-0.5)};
  `,
)
const CloseButton = styled(Button)<{
  colorSet: { fgColor?: string; bgColor?: string }
  themes: Theme
}>(
  ({
    themes: { color, spacingByChar },
    colorSet: { fgColor = color.TEXT_BLACK, bgColor = color.WHITE },
  }) => css`
    flex-shrink: 0;

    margin-top: ${spacingByChar(-0.5)};
    margin-right: ${spacingByChar(-0.5)};
    margin-bottom: ${spacingByChar(-0.5)};
    color: ${fgColor};

    &:hover,
    &:focus-visible {
      background-color: ${color.hoverColor(bgColor)};
      color: ${fgColor};
    }
  `,
)
