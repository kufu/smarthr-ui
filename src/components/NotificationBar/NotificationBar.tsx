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
type BaseProps = Pick<ComponentProps<typeof shrBase>, 'layer'>

export const NotificationBar: React.FC<Props & ElementProps & BaseProps> = ({
  type,
  bold = false,
  message,
  onClose,
  children,
  role = type === 'info' ? 'status' : 'alert',
  base = 'none',
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
              layer,
            },
          }
        : {
            baseComponent: React.Fragment,
            baseProps: {},
          },
    [base, layer],
  )

  return (
    <WrapBase {...baseProps}>
      <Wrapper
        {...props}
        className={`${type} ${classNames.wrapper}${className && ` ${className}`}`}
        role={role}
        themes={theme}
        colorSet={colorSet}
        onBase={base === 'base'}
      >
        <Inner>
          <MessageArea themes={theme} className={classNames.messageArea}>
            <Icon text={message} color={iconColor} iconGap={0.5} />
          </MessageArea>
          {children && (
            <ActionArea themes={theme} className={classNames.actionArea}>
              <ActionWrapper
                themes={theme}
                className={classNames.actions}
                align="center"
                justify="flex-end"
              >
                {children}
              </ActionWrapper>
            </ActionArea>
          )}
        </Inner>
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
      </Wrapper>
    </WrapBase>
  )
}

const Base = styled(shrBase).attrs({ overflow: 'hidden' })``

const Wrapper = styled.div<{
  themes: Theme
  colorSet: { fgColor?: string; bgColor?: string }
  onBase: boolean
  animate?: boolean
}>(
  ({
    themes: { color, fontSize, leading, space },
    colorSet: { fgColor = color.TEXT_BLACK, bgColor = color.WHITE },
    onBase,
    animate,
  }) => css`
    display: flex;
    gap: ${space(0.5)};
    align-items: baseline;
    justify-content: space-between;
    background-color: ${bgColor};
    padding: ${space(0.75)};
    ${onBase &&
    css`
      padding-block: ${space(1)};
      padding-inline: ${space(1.5)} ${space(1)};
    `}
    color: ${fgColor};
    ${animate &&
    css`
      /* 1行の場合の高さ分だけスライドさせる */
      /* stylelint-disable-next-line */
      animation: ${slideIn(`calc(${fontSize.M} * ${leading.TIGHT} + ${space(1.5)})`)} 0.2s ease-out;
    `}
  `,
)
const Inner = styled(Cluster).attrs({
  gap: 1,
  align: 'center',
  justify: 'flex-end',
})`
  flex-grow: 1;
`
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
  ({ themes: { leading, spacingByChar } }) => css`
    display: flex;
    gap: ${spacingByChar(0.5)};
    align-items: center;
    flex-grow: 1;

    .smarthr-ui-Icon-withText {
      line-height: ${leading.TIGHT};
    }
  `,
)
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
    margin-block: ${spacingByChar(-0.5)};
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
