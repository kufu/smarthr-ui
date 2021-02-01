import React, { FC, ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { Theme, useTheme } from '../../hooks/useTheme'
import { StatusLabel, Props as StatusLabelProps } from '../StatusLabel'
import { Heading, HeadingTypes } from '../Heading'
import { FaExclamationCircleIcon } from '../Icon'

type innerMarginType = 'XXS' | 'XS' | 'S'
type Props = {
  label: string
  labelType?: HeadingTypes
  labelId?: string
  innerMargin?: innerMarginType
  statusLabels?: StatusLabelProps[]
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
    <Wrapper className={`${className} ${disabledClass}`} themes={theme}>
      <Label themes={theme} id={labelId} margin={innerMargin}>
        <TitleWrapper>
          <Title type={labelType} disabled={disabled}>
            {label}
          </Title>
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

        {helpMessage && <HelpMessage themes={theme}>{helpMessage}</HelpMessage>}

        {errorMessages &&
          (typeof errorMessages === 'string' ? [errorMessages] : errorMessages).map(
            (message, index) => (
              <ErrorMessage themes={theme} key={index}>
                <ErrorIcon
                  color={disabled ? theme.palette.TEXT_DISABLED : theme.palette.DANGER}
                  themes={theme}
                  size={14}
                />
                <ErrorText>{message}</ErrorText>
              </ErrorMessage>
            ),
          )}
      </Label>
      <Body>{children}</Body>
    </Wrapper>
  )
}

const Wrapper = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { palette } = themes
    return css`
      display: block;

      &.disabled {
        color: ${palette.TEXT_DISABLED};
      }
    `
  }}
`

const Label = styled.label<{ themes: Theme; margin: innerMarginType }>`
  ${({ themes, margin }) => {
    const { size } = themes

    return css`
      display: block;
      margin-bottom: ${size.pxToRem(size.space[margin])};
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
      line-height: 1;
    `
  }}
`

const ErrorText = styled.span`
  vertical-align: middle;
`

const ErrorIcon = styled(FaExclamationCircleIcon)<{ themes: Theme }>`
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
