import React, { HTMLAttributes, ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useId } from '../../hooks/useId'
import { useClassNames } from './useClassNames'

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
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

export const FieldSet: VFC<Props & ElementProps> = ({
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
  const classNames = useClassNames()

  return (
    <Wrapper
      $width={props.width || 'auto'}
      className={`${className} ${classNames.wrapper}`}
      aria-describedby={helpMessage ? helpId : undefined}
    >
      <Title themes={theme} className={classNames.title}>
        <TitleText type={labelType} tag={labelTagType} className={classNames.titleText}>
          {label}
        </TitleText>

        {props.required && (
          <StatusLabel type="required" className={classNames.label}>
            必須
          </StatusLabel>
        )}

        {labelSuffix && labelSuffix}
      </Title>

      {children ? (
        children
      ) : (
        <Input {...props} error={!!errorMessage} className={classNames.input} />
      )}

      {errorMessage &&
        (typeof errorMessage === 'string' ? [errorMessage] : errorMessage).map((message) => (
          <Error themes={theme} key={message} className={classNames.error}>
            <ErrorIcon color={theme.palette.DANGER} className={classNames.errorIcon} />
            <ErrorText className={classNames.errorText}>{message}</ErrorText>
          </Error>
        ))}

      {helpMessage && (
        <Help id={helpId} themes={theme} className={classNames.help}>
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
  ${({ themes: { spacingByChar } }) => css`
    display: flex;
    align-items: center;
    margin: 0 0 ${spacingByChar(0.5)};

    > *:not(:first-child) {
      margin-left: ${spacingByChar(0.5)};
    }
  `}
`
const TitleText = styled(Heading)`
  display: inline-block;
`
const Help = styled.div<{ themes: Theme }>`
  ${({ themes: { color, size, spacingByChar } }) => css`
    margin: ${spacingByChar(0.5)} 0 0 0;
    font-size: ${size.pxToRem(size.font.SHORT)};
    line-height: 1;
    color: ${color.TEXT_GREY};
  `}
`
const Error = styled.div<{ themes: Theme }>`
  ${({ themes: { size, spacingByChar } }) => css`
    margin: ${spacingByChar(0.5)} 0 0 0;
    font-size: ${size.pxToRem(size.font.SHORT)};
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
