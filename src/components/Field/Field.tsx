import React, { ReactNode, FC } from 'react'
import styled, { css } from 'styled-components'

import { Input, Props as InputProps } from '../Input'
import { Heading, HeadingTypes, HeadingTagTypes } from '../Heading'
import { StatusLabel } from '../StatusLabel'
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
      <LabelHead themes={theme}>
        <Title themes={theme}>
          <Heading type={labelType} tag={labelTagType}>
            {label}
          </Heading>

          {props.required && (
            <StatusLabelWrapper themes={theme}>
              <StatusLabel type="required">必須</StatusLabel>
            </StatusLabelWrapper>
          )}
        </Title>
        {helpMessage && <Help themes={theme}>{helpMessage}</Help>}
      </LabelHead>
      {children ? children : <Input {...props} error={!!errorMessage} />}
      {errorMessage && <Error themes={theme}>{errorMessage}</Error>}
    </Wrapper>
  )
}

const Wrapper: any = styled.div<{ width: string | number }>`
  ${({ width }) => css`
    display: inline-block;
    width: ${typeof width === 'number' ? `${width}px` : width};
  `}
`
const LabelHead = styled.div<{ themes: Theme }>`
  ${({ themes }) => css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${themes.size.pxToRem(themes.size.space.XXS)};
    line-height: 1.4;
  `}
`
const Title = styled.p<{ themes: Theme }>`
  ${({ themes }) => css`
    margin: 0;
    color: ${themes.palette.TEXT_GREY};
    font-weight: bold;
    font-size: ${themes.size.pxToRem(themes.size.font.TALL)};
  `}
`
const Help = styled.p<{ themes: Theme }>`
  ${({ themes }) => css`
    margin: 0;
    font-size: ${themes.size.pxToRem(themes.size.font.SHORT)};
    color: ${themes.palette.TEXT_GREY};
  `}
`
const Error = styled.p<{ themes: Theme }>`
  ${({ themes }) => css`
    margin: ${themes.size.pxToRem(themes.size.space.XXS)} 0 0 0;
    font-size: ${themes.size.pxToRem(themes.size.font.TALL)};
    color: ${themes.palette.DANGER};
    line-height: 1.4;
  `}
`
const StatusLabelWrapper = styled.span<{ themes: Theme }>`
  ${({ themes }) => css`
    margin-left: ${themes.size.pxToRem(themes.size.space.XXS)};
  `}
`
