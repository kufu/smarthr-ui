import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

import { Input, Props as InputProps } from '../Input'
import { StatusLabel } from '../StatusLabel'

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

type Props = Omit<InputProps, 'error'> & {
  label: string
  error?: string
  help?: string
  className?: string
}

const FieldComponent: React.FC<Props & InjectedProps> = props => {
  const { label, required, error, help, width, className = '', theme, children } = props

  return (
    <Wrapper width={width} className={className}>
      <LabelHead theme={theme}>
        <Title theme={theme}>
          {label}
          {required && (
            <StatusLabelWrapper theme={theme}>
              <StatusLabel type="required">必須</StatusLabel>
            </StatusLabelWrapper>
          )}
        </Title>
        {help && <Help theme={theme}>{help}</Help>}
      </LabelHead>
      {children ? children : <Input {...props} width={width} error={!!error} />}
      {error && <Error theme={theme}>{error}</Error>}
    </Wrapper>
  )
}

export const Field = withTheme(FieldComponent)

const Wrapper: any = styled.div<{ width: string | number }>`
  ${({ width }) => css`
    display: inline-block;
    width: ${typeof width === 'number' ? `${width}px` : width};
  `}
`
const LabelHead = styled.div`
  ${({ theme }: InjectedProps) => css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${theme.size.pxToRem(theme.size.space.XXS)};
    line-height: 1.4;
  `}
`
const Title = styled.p`
  ${({ theme }: InjectedProps) => css`
    margin: 0;
    color: ${theme.palette.TEXT_GREY};
    font-weight: bold;
    font-size: ${theme.size.pxToRem(theme.size.font.TALL)};
  `}
`
const Help = styled.p`
  ${({ theme }: InjectedProps) => css`
    margin: 0;
    font-size: ${theme.size.pxToRem(theme.size.font.SHORT)};
    color: ${theme.palette.TEXT_GREY};
  `}
`
const Error = styled.p`
  ${({ theme }: InjectedProps) => css`
    margin: ${theme.size.pxToRem(theme.size.space.XXS)} 0 0 0;
    font-size: ${theme.size.pxToRem(theme.size.font.TALL)};
    color: ${theme.palette.DANGER};
    line-height: 1.4;
  `}
`

const StatusLabelWrapper = styled.span`
  ${({ theme }: InjectedProps) => css`
    margin-left: ${theme.size.pxToRem(theme.size.space.XXS)};
  `}
`
