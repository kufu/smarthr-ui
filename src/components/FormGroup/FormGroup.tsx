import React, { ComponentProps, FC, ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { Theme, useTheme } from '../../hooks/useTheme'
import { StatusLabel } from '../StatusLabel'
import { Heading, HeadingTypes } from '../Heading'
import { FaExclamationCircleIcon } from '../Icon'

type innerMarginType = 'XXS' | 'XS' | 'S'
type Props = {
  label: string
  labelType?: HeadingTypes
  labelId?: string
  innerMargin?: innerMarginType
  statusLabelProps?: Array<ComponentProps<typeof StatusLabel>>
  helpMessage?: ReactNode
  errorMessages?: string | string[]
  children: ReactNode
  disabled?: boolean
  className?: string
}

export const FormGroup: FC<Props> = ({
  label,
  labelType = 'blockTitle',
  labelId,
  innerMargin = 'XS',
  statusLabelProps = [],
  helpMessage,
  errorMessages,
  children,
  disabled,
  className = '',
}) => {
  const theme = useTheme()
  const disabledClass = disabled ? 'disabled' : ''

  return (
    <Wrapper className={`${className} ${disabledClass}`} themes={theme}>
      <Label id={labelId}>
        <TitleWrapper>
          <Title type={labelType} themes={theme} className={disabledClass}>
            {label}
          </Title>
          {statusLabelProps.length > 0 && (
            <StatusLabels themes={theme}>
              {statusLabelProps.map((statusLabelProp, index) => (
                <StyledStatusLabel {...statusLabelProp} key={index} themes={theme} />
              ))}
            </StatusLabels>
          )}
        </TitleWrapper>

        {helpMessage && <HelpMessage themes={theme}>{helpMessage}</HelpMessage>}

        {errorMessages &&
          (typeof errorMessages === 'string' ? [errorMessages] : errorMessages).map(
            (message, index) => (
              <ErrorMessage themes={theme} key={index}>
                <ErrorIcon
                  color={disabled ? theme.color.TEXT_DISABLED : theme.color.DANGER}
                  themes={theme}
                  size={14}
                />
                <ErrorText>{message}</ErrorText>
              </ErrorMessage>
            ),
          )}
        <Body themes={theme} margin={innerMargin}>
          {children}
        </Body>
      </Label>
    </Wrapper>
  )
}

const Wrapper = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { color } = themes
    return css`
      display: block;

      &.disabled {
        color: ${color.TEXT_DISABLED};
      }
    `
  }}
`

const Label = styled.label`
  display: block;
`

const TitleWrapper = styled.div`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
`

const Title = styled(Heading)<{ themes: Theme }>`
  display: inline-block;

  &.disabled {
    color: ${({ themes }) => themes.color.TEXT_DISABLED};
  }
`

const StatusLabels = styled.span<{ themes: Theme }>`
  ${({ themes }) => {
    const { fontSize, spacing } = themes

    return css`
      margin-left: ${fontSize.pxToRem(spacing.XXS)};
      display: inline-block;
      line-height: 1;
    `
  }}
`

const StyledStatusLabel = styled(StatusLabel)<{ themes: Theme }>`
  ${({ themes }) => {
    const { fontSize } = themes

    return css`
      margin-right: ${fontSize.pxToRem(4)};
      display: inline-block;
    `
  }}
`

const HelpMessage = styled.span<{ themes: Theme }>`
  ${({ themes }) => {
    const { fontSize, spacing } = themes

    return css`
      display: block;
      margin-top: ${fontSize.pxToRem(spacing.XXS)};
      font-size: ${fontSize.pxToRem(fontSize.TALL)};
    `
  }}
`

const ErrorMessage = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { fontSize, spacing } = themes

    return css`
      margin-top: ${fontSize.pxToRem(spacing.XXS)};
      font-size: ${fontSize.pxToRem(fontSize.TALL)};
      line-height: 1;
    `
  }}
`

const ErrorText = styled.span`
  vertical-align: middle;
`

const ErrorIcon = styled(FaExclamationCircleIcon)<{ themes: Theme }>`
  ${({ themes }) => {
    const { fontSize } = themes

    return css`
      margin-right: ${fontSize.pxToRem(4)};
      vertical-align: middle;
    `
  }}
`

const Body = styled.div<{ themes: Theme; margin: innerMarginType }>`
  ${({ themes, margin }) => {
    const { fontSize, spacing } = themes

    return css`
      display: block;
      margin-top: ${fontSize.pxToRem(spacing[margin])};
    `
  }}
`
