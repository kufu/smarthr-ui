import React, { ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

import { Base, BaseElementProps } from '../Base'
import {
  FaCheckCircleIcon,
  FaExclamationCircleIcon,
  FaExclamationTriangleIcon,
  FaInfoCircleIcon,
} from '../Icon'

type IconType = 'info' | 'success' | 'warning' | 'error'

type Props = {
  /** 表示する情報の種類 */
  type?: IconType
  /** コンポーネントに適用するクラス名 */
  className?: string
  /** 表示する情報の内容 */
  children: ReactNode
}

export const CompactInformationPanel: VFC<Props & BaseElementProps> = ({
  type = 'info',
  className = '',
  children,
  ...props
}) => {
  const theme = useTheme()
  const classNames = useClassNames()

  return (
    <Wrapper {...props} className={`${className} ${classNames.wrapper}`} themes={theme}>
      {callIcon(type, theme)}
      <Content className={classNames.content}>{children}</Content>
    </Wrapper>
  )
}

const callIcon = (type: IconType, theme: Theme) => {
  const { color } = theme
  switch (type) {
    case 'info':
    default:
      return <InfoIcon color={color.TEXT_GREY} $theme={theme} />
    case 'success':
      return <SuccessIcon color={color.MAIN} $theme={theme} />
    case 'warning':
      return <WarningIcon color={color.WARNING} $theme={theme} />
    case 'error':
      return <ErrorIcon color={color.DANGER} $theme={theme} />
  }
}

const createIcon = (Icon: typeof FaInfoCircleIcon) =>
  styled(Icon)<{ $theme: Theme }>(
    ({ $theme: { spacingByChar } }) => css`
      flex-shrink: 0;

      /*
      it set line-height to 1.5 and align-items(flexbox) to start(default),
      translate-y 0.25em transform for leading
      */
      transform: translateY(0.25em);
      margin-right: ${spacingByChar(0.5)};
    `,
  )
const InfoIcon = createIcon(FaInfoCircleIcon)
const SuccessIcon = createIcon(FaCheckCircleIcon)
const WarningIcon = createIcon(FaExclamationTriangleIcon)
const ErrorIcon = createIcon(FaExclamationCircleIcon)

const Wrapper = styled(Base)<{ themes: Theme }>`
  ${({ themes: { spacingByChar, shadow } }) => {
    return css`
      display: flex;
      box-shadow: ${shadow.LAYER3};
      padding: ${spacingByChar(1)};
    `
  }}
`
const Content = styled.div`
  line-height: 1.5;
`
