import React, { ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { Base } from '../Base'
import {
  FaCheckCircleIcon,
  FaExclamationCircleIcon,
  FaExclamationTriangleIcon,
  FaInfoCircleIcon,
} from '../Icon'

type IconType = 'info' | 'success' | 'warning' | 'error'
export const CompactInformationPanel: React.VFC<{
  type?: IconType
  children: ReactNode
}> = ({ type = 'info', children }) => {
  const theme = useTheme()

  return (
    <Wrapper themes={theme}>
      {callIcon(type, theme)}
      <Content>{children}</Content>
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
    ({
      $theme: {
        spacing,
        fontSize: { pxToRem },
      },
    }) => css`
      flex-shrink: 0;

      /*
      it set line-height to 1.5 and align-items(flexbox) to start(default),
      translate-y 0.25em transform for leading
      */
      transform: translateY(0.25em);
      margin-right: ${pxToRem(spacing.XXS)};
    `,
  )
const InfoIcon = createIcon(FaInfoCircleIcon)
const SuccessIcon = createIcon(FaCheckCircleIcon)
const WarningIcon = createIcon(FaExclamationTriangleIcon)
const ErrorIcon = createIcon(FaExclamationCircleIcon)

const Wrapper = styled(Base)<{ themes: Theme }>`
  ${({
    themes: {
      fontSize: { pxToRem },
      spacing,
      shadow,
    },
  }) => {
    return css`
      display: flex;
      padding: ${pxToRem(spacing.XS)};
      box-shadow: ${shadow.DIALOG};
    `
  }}
`
const Content = styled.div`
  line-height: 1.5;
`
