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
  className,
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
  }, [type])

  return (
    <Wrapper
      {...props}
      className={`${type} ${classNames.wrapper}${className && ` ${className}`}`}
      role={role}
      themes={theme}
      colorSet={colorSet}
    >
      <ContentsWrapper>
        <Icon color={iconColor} />
        <MessageWrapper>
          <Text>{message}</Text>
          {children && (
            <ActionWrapper themes={theme} className={classNames.actions}>
              {children}
            </ActionWrapper>
          )}
        </MessageWrapper>
      </ContentsWrapper>
      {onClose && (
        <CloseButton
          bgColor={colorSet.bgColor}
          themes={theme}
          onClick={onClose}
          className={classNames.closeButton}
        >
          <FaTimesIcon visuallyHiddenText="閉じる" />
        </CloseButton>
      )}
    </Wrapper>
  )
}

const Wrapper = styled(Cluster).attrs({ align: 'center', justify: 'space-between' })<{
  themes: Theme
  colorSet: { fgColor: string; bgColor: string }
}>(
  ({ themes: { spacingByChar }, colorSet: { fgColor, bgColor } }) => css`
    background-color: ${bgColor};
    padding-top: ${spacingByChar(0.75)};
    padding-right: ${spacingByChar(1)};
    padding-bottom: ${spacingByChar(0.75)};
    padding-left: ${spacingByChar(0.75)};
    color: ${fgColor};

    .smarthr-ui-Cluster {
      flex-wrap: revert;
    }
  `,
)
const ContentsWrapper = styled(Cluster).attrs({ align: 'center' })`
  flex-grow: 1;
  /* flexbox で ellipsis するために min-width をつけて幅の計算を発生させている */
  min-width: 0;

  .smarthr-ui-Icon {
    flex-shrink: 0;
  }
`
const MessageWrapper = styled(Sidebar).attrs({
  align: 'center',
  gap: { row: 0.75, column: 1 },
  right: true,
})`
  flex-grow: 1;
  /* flexbox で ellipsis するために min-width をつけて幅の計算を発生させている */
  min-width: 0;
`
const ActionWrapper = styled(Cluster).attrs({ align: 'center', justify: 'flex-end' })<{
  themes: Theme
}>(
  ({ themes: { spacingByChar } }) => css`
    margin-top: ${spacingByChar(-0.5)};
    margin-bottom: ${spacingByChar(-0.5)};
  `,
)
const CloseButton = styled(TextButton).attrs({ size: 's' })<{
  bgColor: string
  themes: Theme
}>(
  ({ bgColor, themes: { color, spacingByChar } }) => css`
    margin-top: ${spacingByChar(-0.5)};
    margin-right: ${spacingByChar(-0.5)};
    margin-bottom: ${spacingByChar(-0.5)};

    &:hover,
    &:focus {
      background-color: ${color.hoverColor(bgColor)};
    }
  `,
)
