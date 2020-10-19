import React, { FC, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { Input, Props as InputProps } from '../Input'
import { Heading, HeadingTypes } from '../Heading'
import { StatusLabel } from '../StatusLabel'
import { Icon } from '../Icon'
import { useId } from '../../hooks/useId'

type Props = Omit<InputProps, 'error'> & {
  label: string
  labelType?: HeadingTypes
  errorMessage?: string | string[]
  helpMessage?: string
  labelSuffix?: ReactNode
  className?: string
  htmlFor?: string
}

export const FieldSet: FC<Props> = ({
  label,
  labelType = 'subBlockTitle',
  errorMessage,
  helpMessage,
  className = '',
  labelSuffix,
  children,
  htmlFor,
  ...props
}) => {
  const theme = useTheme()
  const fieldSetId = useId(htmlFor)

  return (
    <Wrapper width={props.width || 'auto'} className={className}>
      <Title themes={theme}>
        <Label htmlFor={children && !htmlFor ? undefined : fieldSetId}>
          <TitleText type={labelType} tag="span">
            {label}
          </TitleText>
        </Label>
        {props.required && <StatusLabel type="required">必須</StatusLabel>}

        {labelSuffix && labelSuffix}
      </Title>

      {children ? children : <Input {...props} error={!!errorMessage} id={fieldSetId} />}
      {errorMessage &&
        (typeof errorMessage === 'string' ? [errorMessage] : errorMessage).map((message) => (
          <Error themes={theme} key={message}>
            <ErrorIcon name="fa-exclamation-circle" color={theme.palette.DANGER} />
            <ErrorText>{message}</ErrorText>
          </Error>
        ))}

      {helpMessage && <Help themes={theme}>{helpMessage}</Help>}
    </Wrapper>
  )
}

const Wrapper = styled.div<{ width: string | number }>`
  ${({ width }) => css`
    display: inline-block;
    width: ${typeof width === 'number' ? `${width}px` : width};
  `}
`
const Title = styled.div<{ themes: Theme }>`
  ${({ themes }) => css`
    display: flex;
    align-items: center;
    margin: 0 0 ${themes.size.pxToRem(themes.size.space.XXS)};

    > *:not(:first-child) {
      margin-left: ${themes.size.pxToRem(themes.size.space.XXS)};
    }
  `}
`
const Label = styled.label`
  line-height: 0;
`
const TitleText = styled(Heading)`
  display: inline-block;
`
const Help = styled.div<{ themes: Theme }>`
  ${({ themes }) => css`
    margin: ${themes.size.pxToRem(themes.size.space.XXS)} 0 0 0;
    font-size: ${themes.size.pxToRem(themes.size.font.SHORT)};
    line-height: 1;
    color: ${themes.palette.TEXT_GREY};
  `}
`
const Error = styled.div<{ themes: Theme }>`
  ${({ themes }) => css`
    margin: ${themes.size.pxToRem(themes.size.space.XXS)} 0 0 0;
    font-size: ${themes.size.pxToRem(themes.size.font.SHORT)};
    line-height: 1;
  `}
`
const ErrorIcon = styled(Icon)`
  margin-right: 0.4rem;
  vertical-align: middle;
`
const ErrorText = styled.span`
  vertical-align: middle;
`
