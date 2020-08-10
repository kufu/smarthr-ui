import React, { FC, ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { Theme, useTheme } from '../../hooks/useTheme'
import { StatusLabel, Props as StatusLabelProps } from '../StatusLabel'
import { Heading, HeadingTypes } from '../Heading'

interface Props {
  label: string
  labelType?: HeadingTypes
  labelId?: string
  statusLabels?: StatusLabelProps[]
  helpMessage?: ReactNode
  errorMessages?: string[]
  children: ReactNode
  disabled?: boolean
  className?: string
}

export const FormGroup: FC<Props> = ({
  label,
  labelType = 'blockTitle',
  labelId,
  statusLabels,
  helpMessage,
  errorMessages,
  children,
  disabled,
  className,
}) => {
  const theme = useTheme()
  const disabledClass = disabled ? 'disabled' : ''

  return (
    <Wrapper className={className}>
      <Label themes={theme} id={labelId}>
        <Heading type={labelType}>{label}</Heading>
        {statusLabels && (
          <StatusLabels themes={theme}>
            {statusLabels.map((StatusLabelItem, index) => (
              <StatusLabel key={index}>{StatusLabelItem.children}</StatusLabel>
            ))}
          </StatusLabels>
        )}
        {helpMessage && (
          <HelpMessage themes={theme} className={disabledClass}>
            {helpMessage}
          </HelpMessage>
        )}
        {errorMessages &&
          errorMessages.map((errorMessageItem, index) => (
            <ErrorMessage themes={theme} key={index} className={disabledClass}>
              {errorMessageItem}
            </ErrorMessage>
          ))}
      </Label>
      <Body>{children}</Body>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: block;
`

const Label = styled.label<{ themes: Theme }>`
  ${({ themes }) => {
    const { size } = themes

    return css`
      margin-bottom: ${size.pxToRem(size.space.XS)};
      display: block;
    `
  }}
`

const StatusLabels = styled.label<{ themes: Theme }>`
  ${({ themes }) => {
    const { size } = themes

    return css`
      margin-bottom: ${size.pxToRem(size.space.XS)};
      display: block;
    `
  }}
`

const HelpMessage = styled.span<{ themes: Theme }>`
  ${({ themes }) => {
    const { size } = themes

    return css`
      margin-bottom: ${size.pxToRem(size.space.XS)};
      display: block;
    `
  }}
`

const ErrorMessage = styled.label<{ themes: Theme }>`
  ${({ themes }) => {
    const { size } = themes

    return css`
      margin-bottom: ${size.pxToRem(size.space.XS)};
      display: block;
    `
  }}
`

const Body = styled.div`
  display: block;
`
