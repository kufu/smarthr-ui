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
  right?: number
  bottom?: number
  left?: number
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
      {tertiaryButton && <TertiaryArea>{tertiaryButton}</TertiaryArea>}
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
  ${({ themes: { spacing, fontSize }, top, right, bottom, left, $width, zIndex = 500 }) => {
    return css`
      display: flex;
      align-items: center;
      position: fixed;
      ${top && `top: ${top}px;`}
      ${right && `right: ${right}px;`}
      ${bottom && `bottom: ${bottom}px;`}
      ${left && `left: ${left}px;`}
      z-index: ${zIndex};
      width: ${$width};
      padding: ${fontSize.pxToRem(spacing.XS)};
    `
  }}
`

const ActionArea = styled.div<{ themes: Theme }>`
  ${({ themes: { fontSize, spacing } }) => {
    return css`
      margin-left: 0;
      > button,
      > a {
        margin-left: ${fontSize.pxToRem(spacing.XS)};
      }
    `
  }}
`
const TertiaryArea = styled.div`
  margin-right: 0;
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
