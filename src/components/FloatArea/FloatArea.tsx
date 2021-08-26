import React, {
  ComponentProps,
  FunctionComponentElement,
  HTMLAttributes,
  ReactNode,
  VFC,
} from 'react'
import styled, { css } from 'styled-components'

import { DialogBase as BaseComponent } from '../Base'
import { FaExclamationCircleIcon, FaExclamationTriangleIcon } from '../Icon'
import { Text } from '../Text'
import { LineUp } from '../Layout'
import { Theme, useTheme } from '../../hooks/useTheme'

type StyleProps = {
  top?: number
  bottom?: number
  zIndex?: number
}
type ErrorIcons =
  | FunctionComponentElement<ComponentProps<typeof FaExclamationTriangleIcon>>
  | FunctionComponentElement<ComponentProps<typeof FaExclamationCircleIcon>>
type Props = StyleProps & {
  primaryButton: ReactNode
  secondaryButton?: ReactNode
  tertiaryButton?: ReactNode
  errorText?: string
  errorIcon?: ErrorIcons
  width?: string
  className?: string
}
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

const exist = (value: any) => {
  return value !== undefined && value !== null
}

export const FloatArea: VFC<Props & ElementProps> = ({
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
      <LineUp align="space-between" vAlign="center">
        {tertiaryButton && tertiaryButton}
        <RightSide gap={1} vAlign="center">
          {errorText && (
            <ErrorMessage gap={0.25} vAlign="center" as="p">
              {errorIcon && <ErrorIcon themes={theme}>{errorIcon}</ErrorIcon>}
              <Text size="S">{errorText}</Text>
            </ErrorMessage>
          )}
          {secondaryButton && secondaryButton}
          {primaryButton && primaryButton}
        </RightSide>
      </LineUp>
    </Base>
  )
}

const Base = styled(BaseComponent)<StyleProps & { themes: Theme; $width: string }>`
  ${({ themes: { spacingByChar }, top, bottom, $width, zIndex = 500 }) =>
    css`
      position: fixed;
      ${exist(top) && `top: ${top}px;`}
      ${exist(bottom) && `bottom: ${bottom}px;`}
      z-index: ${zIndex};
      width: ${$width};
      padding: ${spacingByChar(1)};
    `}
`
const RightSide = styled(LineUp)`
  margin-left: auto;
`
const ErrorMessage = styled(LineUp)`
  margin-top: 0;
  margin-bottom: 0;
`
const ErrorIcon = styled.span<{ themes: Theme }>`
  flex-shrink: 0;

  > svg {
    display: block; /* 隙間対策 */
  }
`
