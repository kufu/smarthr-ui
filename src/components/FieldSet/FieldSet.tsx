import React, { FC, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useId } from '../../hooks/useId'

import { Input, Props as InputProps } from '../Input'
import { Heading, HeadingTagTypes, HeadingTypes } from '../Heading'
import { StatusLabel } from '../StatusLabel'
import { FaExclamationCircleIcon } from '../Icon'

type Props = Omit<InputProps, 'error'> & {
  label: string
  labelType?: HeadingTypes
  labelTagType?: HeadingTagTypes
  errorMessage?: string | string[]
  helpMessage?: string
  labelSuffix?: ReactNode
  className?: string
}

export const FieldSet: FC<Props> = ({
  label,
  labelType = 'subBlockTitle',
  labelTagType = 'span',
  errorMessage,
  helpMessage,
  className = '',
  labelSuffix,
  children,
  ...props
}) => {
  const theme = useTheme()
  const helpId = useId()

  return (
    <Wrapper
      $width={props.width || 'auto'}
      className={className}
      aria-describedby={helpMessage ? helpId : undefined}
    >
      <Title themes={theme}>
        <TitleText type={labelType} tag={labelTagType}>
          {label}
        </TitleText>

        {props.required && <StatusLabel type="required">必須</StatusLabel>}

        {labelSuffix && labelSuffix}
      </Title>

      {children ? children : <Input {...props} error={!!errorMessage} />}

      {errorMessage &&
        (typeof errorMessage === 'string' ? [errorMessage] : errorMessage).map((message) => (
          <Error themes={theme} key={message}>
            <ErrorIcon color={theme.palette.DANGER} />
            <ErrorText>{message}</ErrorText>
          </Error>
        ))}

      {helpMessage && (
        <Help id={helpId} themes={theme}>
          {helpMessage}
        </Help>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div<{ $width: string | number }>`
  ${({ $width }) => css`
    display: inline-block;
    width: ${typeof $width === 'number' ? `${$width}px` : $width};
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
const ErrorIcon = styled(FaExclamationCircleIcon)`
  margin-right: 0.4rem;
  vertical-align: middle;
`
const ErrorText = styled.span`
  vertical-align: middle;
`
