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
  children,
  width = '80%',
  ...props
}) => {
  const theme = useTheme()

  return (
    <Base themes={theme} className={className} $width={width} {...props}>
      {tertiaryButton && <TertiaryArea>{tertiaryButton}</TertiaryArea>}
      {errorText && (
        <ErrorTextArea>
          {errorIcon && <ErrorIcon>{errorIcon}</ErrorIcon>}
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
  ${({ themes, top, right, bottom, left, $width, zIndex = 500 }) => {
    const { pxToRem, space } = themes.size
    const positionRight = exist(right) ? `${right}px` : 'initial'
    const positionBottom = exist(bottom) ? `${bottom}px` : 'initial'
    const positionTop = exist(top) ? `${top}px` : 'initial'
    const positionLeft = exist(left) ? `${left}px` : 'initial'

    return css`
      display: flex;
      align-items: center;
      position: fixed;
      top: ${positionTop};
      bottom: ${positionBottom};
      right: ${positionRight};
      left: ${positionLeft};
      z-index: ${zIndex};
      width: ${$width};
      padding: ${pxToRem(space.XS)};
    `
  }}
`

const ActionArea = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space } = themes.size
    return css`
      > button,
      > a {
        margin-left: ${pxToRem(space.XS)};
      }
    `
  }}
`
const TertiaryArea = styled.div`
  margin: 0 auto 0 0;
`
const ErrorTextArea = styled.div`
  display: flex;
  text-align: left;
  align-items: center;
  line-height: 1;
  max-width: 40%;
`
const ErrorIcon = styled.div`
  width: 16px;
  flex-shrink: 0;
`
const ErrorText = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, font, space } = themes.size
    return css`
      font-size: ${pxToRem(font.SHORT)};
      margin-left: ${pxToRem(space.XXS)};
    `
  }}
`
