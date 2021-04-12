import React, { ComponentProps, ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'
import { Theme, useTheme } from '../../hooks/useTheme'
import { StatusLabel } from '../StatusLabel'
import { Heading, HeadingTagTypes, HeadingTypes } from '../Heading'
import { FaExclamationCircleIcon } from '../Icon'

type innerMarginType = 'XXS' | 'XS' | 'S'
type Props = {
  title: string
  titleTag?: HeadingTagTypes
  titleType?: HeadingTypes
  labelId?: string
  innerMargin?: innerMarginType
  statusLabelProps?: Array<ComponentProps<typeof StatusLabel>>
  helpMessage?: ReactNode
  errorMessages?: string | string[]
  disabled?: boolean
  className?: string
  children: ReactNode
}

export const FormGroup: VFC<Props> = ({
  title,
  titleTag,
  titleType,
  labelId,
  innerMargin = 'XS',
  statusLabelProps = [],
  helpMessage,
  errorMessages,
  disabled,
  className = '',
  children,
}) => {
  const theme = useTheme()
  const disabledClass = disabled ? 'disabled' : ''

  return (
    <Label id={labelId} className={`${className} ${disabledClass}`} themes={theme}>
      <TitleWrapper>
        <Title tag={titleTag} type={titleType} themes={theme} className={disabledClass}>
          {title}
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
              <span>{message}</span>
            </ErrorMessage>
          ),
        )}
      <Body themes={theme} margin={innerMargin}>
        {children}
      </Body>
    </Label>
  )
}

const Label = styled.label<{ themes: Theme }>`
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

const TitleWrapper = styled.span`
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

const ErrorMessage = styled.span<{ themes: Theme }>`
  ${({ themes }) => {
    const { fontSize, spacing } = themes

    return css`
      display: flex;
      align-items: center;
      margin-top: ${fontSize.pxToRem(spacing.XXS)};
      font-size: ${fontSize.pxToRem(fontSize.TALL)};
      line-height: 1;
    `
  }}
`

const ErrorIcon = styled(FaExclamationCircleIcon)<{ themes: Theme }>`
  ${({ themes }) => {
    const { fontSize } = themes

    return css`
      margin-right: ${fontSize.pxToRem(4)};
    `
  }}
`

const Body = styled.span<{ themes: Theme; margin: innerMarginType }>`
  ${({ themes, margin }) => {
    const { fontSize, spacing } = themes

    return css`
      display: block;
      margin-top: ${fontSize.pxToRem(spacing[margin])};
    `
  }}
`
