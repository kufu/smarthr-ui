import React, { ComponentProps, FC, FunctionComponentElement, ReactNode, useEffect } from 'react'
import styled, { css } from 'styled-components'

import { validateElement } from './FloatAreaHelper'
import { DialogBase as BaseComponent } from '../Base'
import { FaExclamationCircleIcon, FaExclamationTriangleIcon } from '../Icon'
import {
  PrimaryButton,
  PrimaryButtonAnchor,
  SecondaryButton,
  SecondaryButtonAnchor,
} from '../Button'
import { Theme, useTheme } from '../../hooks/useTheme'

export type Primary =
  | FunctionComponentElement<ComponentProps<typeof PrimaryButton>>
  | FunctionComponentElement<ComponentProps<typeof PrimaryButtonAnchor>>

export type Secondary =
  | FunctionComponentElement<ComponentProps<typeof SecondaryButton>>
  | FunctionComponentElement<ComponentProps<typeof SecondaryButtonAnchor>>

export type errorIcons =
  | FunctionComponentElement<ComponentProps<typeof FaExclamationTriangleIcon>>
  | FunctionComponentElement<ComponentProps<typeof FaExclamationCircleIcon>>

interface Props {
  primaryButton: Primary
  secondaryButton?: Secondary
  tertiaryButton?: ReactNode
  errorText?: string
  errorIcon?: errorIcons
  top?: number
  left?: number
  right?: number
  bottom?: number
  width?: string
  zIndex?: number
  className?: string
}

type StyleProps = {
  top?: number
  right?: number
  bottom?: number
  left?: number
  zIndex?: number
}

function exist(value: any) {
  return value !== undefined && value !== null
}

export const FloatArea: FC<Props> = ({
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

  useEffect(() => {
    validateElement(primaryButton, secondaryButton)
  }, [primaryButton, secondaryButton])

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
      margin: 0 0 auto 0;
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
  max-width: 256px;
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
