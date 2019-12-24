import React, { ReactNode, FC } from 'react'
import styled, { css } from 'styled-components'

import { Input, Props as InputProps } from '../Input'
import { Heading, HeadingTypes, HeadingTagTypes } from '../Heading'
import { StatusLabel } from '../StatusLabel'
import { Icon } from '../Icon'
import { useTheme, Theme } from '../../hooks/useTheme'

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

type Props = Omit<InputProps, 'error'> & {
  label: string
  labelType?: HeadingTypes
  labelTagType?: HeadingTagTypes
  errorMessage?: string
  helpMessage?: string
  className?: string
  children?: ReactNode
}

export const Field: FC<Props> = ({
  label,
  labelType = 'subBlockTitle',
  labelTagType = 'span',
  errorMessage,
  helpMessage,
  className = '',
  children,
  ...props
}) => {
  const theme = useTheme()

  return (
    <Wrapper width={props.width || 'auto'} className={className}>
      <Title themes={theme}>
        <TitleText type={labelType} tag={labelTagType}>
          {label}
        </TitleText>

        {props.required && (
          <StatusLabelWrapper themes={theme}>
            <StatusLabel type="required">必須</StatusLabel>
          </StatusLabelWrapper>
        )}
      </Title>
      {children ? children : <Input {...props} error={!!errorMessage} />}
      {errorMessage && (
        <Error themes={theme}>
          <ErrorIcon name="fa-exclamation-circle" themes={theme} color={theme.palette.DANGER} />
          {errorMessage}
        </Error>
      )}
      {helpMessage && <Help themes={theme}>{helpMessage}</Help>}
    </Wrapper>
  )
}

const Wrapper: any = styled.div<{ width: string | number }>`
  ${({ width }) => css`
    display: inline-block;
    width: ${typeof width === 'number' ? `${width}px` : width};
  `}
`

const Title = styled.div<{ themes: Theme }>`
  ${({ themes }) => css`
    margin: 0 0 ${themes.size.pxToRem(themes.size.space.XXS)};
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

const ErrorIcon = styled(Icon)<{ themes: Theme }>`
  ${({ themes }) => css`
    margin-right: ${themes.size.pxToRem(4)};
    vertical-align: middle;
  `}
`

const StatusLabelWrapper = styled.span<{ themes: Theme }>`
  ${({ themes }) => css`
    margin-left: ${themes.size.pxToRem(themes.size.space.XXS)};
  `}
`
