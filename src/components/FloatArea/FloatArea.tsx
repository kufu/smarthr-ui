import React, { ComponentProps, FunctionComponentElement, ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'

import { DialogBase as BaseComponent } from '../Base'
import { FaExclamationCircleIcon, FaExclamationTriangleIcon } from '../Icon'
import { Theme, useTheme } from '../../hooks/useTheme'

type ErrorIcons =
  | FunctionComponentElement<ComponentProps<typeof FaExclamationTriangleIcon>>
  | FunctionComponentElement<ComponentProps<typeof FaExclamationCircleIcon>>

type StyleProps = {
  top?: number
  bottom?: number
  zIndex?: number
}

type Props = StyleProps & {
  primaryButton: ReactNode
  secondaryButton?: ReactNode
  tertiaryButton?: ReactNode
  errorText?: string
  errorIcon?: ErrorIcons
  width?: string
  className?: string
}

const exist = (value: any) => {
  return value !== undefined && value !== null
}

export const FloatArea: VFC<Props> = ({
  primaryButton,
  secondaryButton,
  tertiaryButton,
  errorText,
  errorIcon,
  className = '',
  width = '80%',
  ...props
}) => {
  const theme = useTheme()

  return (
    <Base themes={theme} className={className} $width={width} {...props}>
      {tertiaryButton && tertiaryButton}
      {errorText && (
        <ErrorTextArea>
          {errorIcon && <ErrorIcon themes={theme}>{errorIcon}</ErrorIcon>}
          <ErrorText themes={theme}>{errorText}</ErrorText>
        </ErrorTextArea>
      )}
      <ActionArea themes={theme}>
        {secondaryButton && secondaryButton}
        {primaryButton && primaryButton}
      </ActionArea>
    </Base>
  )
}

const Base = styled(BaseComponent)<StyleProps & { themes: Theme; $width: string }>`
  ${({ themes: { spacing, fontSize }, top, bottom, $width, zIndex = 500 }) => {
    return css`
      display: flex;
      align-items: center;
      position: fixed;
      ${exist(top) && `top: ${top}px;`}
      ${exist(bottom) && `bottom: ${bottom}px;`}
      z-index: ${zIndex};
      width: ${$width};
      padding: ${fontSize.pxToRem(spacing.XS)};
    `
  }}
`

const ActionArea = styled.div<{ themes: Theme }>`
  ${({ themes: { fontSize, spacing } }) => {
    return css`
      > button,
      > a {
        margin-left: ${fontSize.pxToRem(spacing.XS)};
      }
    `
  }}
`
const ErrorTextArea = styled.p`
  display: flex;
  align-items: center;
  margin: 0 0 0 auto;
  line-height: 1;
  max-width: 40%;
`
const ErrorIcon = styled.div<{ themes: Theme }>`
  ${({ themes: { fontSize, spacing } }) => {
    return css`
      margin-right: ${fontSize.pxToRem(spacing.XXS)};
      flex-shrink: 0;
    `
  }}
`

const ErrorText = styled.div<{ themes: Theme }>`
  ${({ themes: { fontSize } }) => {
    return css`
      font-size: ${fontSize.pxToRem(fontSize.SHORT)};
    `
  }}
`
