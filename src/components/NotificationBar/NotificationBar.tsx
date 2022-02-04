import React, { HTMLAttributes, useMemo } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

import {
  FaCheckCircleIcon,
  FaExclamationCircleIcon,
  FaExclamationTriangleIcon,
  FaInfoCircleIcon,
  FaTimesIcon,
} from '../Icon'
import { Cluster, Sidebar } from '../Layout'
import { Text } from '../Text'
import { TextButton } from '../Button'

export const messageTypes = ['info', 'success', 'error', 'warning'] as const

type Props = {
  /** メッセージの種類 */
  type: typeof messageTypes[number]
  /** メッセージ */
  message: React.ReactNode
  /** 閉じるボタン押下時に発火させる関数 */
  onClose?: () => void
  /** アクション群 */
  children?: React.ReactNode
  /** role 属性 */
  role?: 'alert' | 'status'
}
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

export const NotificationBar: React.VFC<Props & ElementProps> = ({
  type,
  message,
  onClose,
  children,
  role = type === 'info' ? 'status' : 'alert',
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
          iconColor: color.MAIN,
          fgColor: color.TEXT_BLACK,
          bgColor: color.WHITE,
        }
      case 'success':
        return {
          Icon: FaCheckCircleIcon,
          iconColor: color.WHITE,
          fgColor: color.TEXT_WHITE,
          bgColor: color.MAIN,
        }
      case 'error':
        return {
          Icon: FaExclamationCircleIcon,
          iconColor: color.WHITE,
          fgColor: color.TEXT_WHITE,
          bgColor: color.DANGER,
        }
      case 'warning':
        return {
          Icon: FaExclamationTriangleIcon,
          iconColor: color.TEXT_BLACK,
          fgColor: color.TEXT_BLACK,
          // FIXME: WARNING の色を見直す時に定数化する
          bgColor: '#ffcc17',
        }
    }
  }, [color, type])

  return (
    <Wrapper
      {...props}
      className={`${type} ${classNames.wrapper}${className && ` ${className}`}`}
      role={role}
      themes={theme}
      colorSet={colorSet}
      align="center"
      justify="space-between"
    >
      <ContentsWrapper align="center">
        <Icon color={iconColor} />
        <MessageWrapper align="center" gap={{ row: 0.75, column: 1 }} right>
          <Text leading="TIGHT">{message}</Text>
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
        </MessageWrapper>
      </ContentsWrapper>
      {onClose && (
        <CloseButton
          colorSet={colorSet}
          themes={theme}
          onClick={onClose}
          className={classNames.closeButton}
          size="s"
        >
          <FaTimesIcon visuallyHiddenText="閉じる" />
        </CloseButton>
      )}
    </Wrapper>
  )
}

const Wrapper = styled(Cluster)<{
  themes: Theme
  colorSet: { fgColor: string; bgColor: string }
}>(
  ({ themes: { spacingByChar }, colorSet: { fgColor, bgColor } }) => css`
    background-color: ${bgColor};
    padding: ${spacingByChar(0.75)};
    color: ${fgColor};

    .smarthr-ui-Cluster {
      flex-wrap: revert;
    }
  `,
)
const ContentsWrapper = styled(Cluster)`
  flex-grow: 1;

  /* flexbox で ellipsis するために min-width をつけて幅の計算を発生させている */
  min-width: 0;

  .smarthr-ui-Icon {
    flex-shrink: 0;
  }
`
const MessageWrapper = styled(Sidebar)`
  flex-grow: 1;

  /* flexbox で ellipsis するために min-width をつけて幅の計算を発生させている */
  min-width: 0;
`
const ActionWrapper = styled(Cluster)<{
  themes: Theme
}>(
  ({ themes: { spacingByChar } }) => css`
    margin-top: ${spacingByChar(-0.5)};
    margin-bottom: ${spacingByChar(-0.5)};
  `,
)
const CloseButton = styled(TextButton)<{
  colorSet: { fgColor: string; bgColor: string }
  themes: Theme
}>(
  ({ colorSet: { fgColor, bgColor }, themes: { color, spacingByChar } }) => css`
    margin-top: ${spacingByChar(-0.5)};
    margin-right: ${spacingByChar(-0.5)};
    margin-bottom: ${spacingByChar(-0.5)};
    color: ${fgColor};

    &:hover,
    &:focus {
      background-color: ${color.hoverColor(bgColor)};
      color: ${fgColor};
    }
  `,
)
