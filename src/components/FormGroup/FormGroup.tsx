import React, { FC, ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { Theme, useTheme } from '../../hooks/useTheme'
import { StatusLabel, Props as StatusLabelProps } from '../StatusLabel'
import { Heading, HeadingTypes } from '../Heading'
import { Icon } from '../Icon'

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
        <TitleWrapper>
          <Title type={labelType}>{label}</Title>
          {statusLabels && (
            <StatusLabels themes={theme}>
              {statusLabels.map((StatusLabelItem, index) => (
                <LabelItem
                  key={index}
                  type={StatusLabelItem.type}
                  className={StatusLabelItem.className}
                  themes={theme}
                >
                  {StatusLabelItem.children}
                </LabelItem>
              ))}
            </StatusLabels>
          )}
        </TitleWrapper>

        {helpMessage && (
          <HelpMessage themes={theme} className={disabledClass}>
            {helpMessage}
          </HelpMessage>
        )}
        {errorMessages &&
          errorMessages.map((errorMessageItem, index) => (
            <ErrorMessage themes={theme} key={index} className={disabledClass}>
              <ErrorIcon
                name="fa-exclamation-circle"
                color={theme.palette.DANGER}
                themes={theme}
                size={14}
              />
              <ErrorText>{errorMessageItem}</ErrorText>
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

const TitleWrapper = styled.div`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
`

const Title = styled(Heading)`
  display: inline-block;
`

const StatusLabels = styled.span<{ themes: Theme }>`
  ${({ themes }) => {
    const { size } = themes

    return css`
      margin-left: ${size.pxToRem(size.space.XXS)};
      display: inline-block;
      line-height: 1;
    `
  }}
`

const LabelItem = styled(StatusLabel)<{ themes: Theme }>`
  ${({ themes }) => {
    const { size } = themes

    return css`
      margin-right: ${size.pxToRem(4)};
      display: inline-block;
    `
  }}
`

const HelpMessage = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { size } = themes

    return css`
      margin-top: ${size.pxToRem(size.space.XXS)};
      font-size: ${size.pxToRem(size.font.TALL)};
    `
  }}
`

const ErrorMessage = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { size } = themes

    return css`
      margin-top: ${size.pxToRem(size.space.XXS)};
      font-size: ${size.pxToRem(size.font.TALL)};
    `
  }}
`

const ErrorText = styled.span`
  vertical-align: middle;
`

const ErrorIcon = styled(Icon)<{ themes: Theme }>`
  ${({ themes }) => {
    const { size } = themes

    return css`
      margin-right: ${size.pxToRem(4)};
      vertical-align: middle;
    `
  }}
`

const Body = styled.div`
  display: block;
`
