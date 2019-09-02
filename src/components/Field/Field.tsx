import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

import { NumberInput, PasswordInput, Props as InputProps, TextInput } from '../Input'
import { Tag } from '../Tag'

interface Props {
  label: string
  name?: string
  value?: string
  required?: boolean
  placeholder?: string
  disabled?: boolean
  error?: string
  help?: string
  width?: number | string
  onChange?: (name: string, value: string) => void
  onBlur?: (name: string, value: string) => void
  children?: React.ReactNode
}

const fieldFactory: (
  InputComponent?: React.ComponentType<InputProps>,
) => React.SFC<Props & InjectedProps> = InputComponent => ({
  label,
  name = '',
  value = '',
  required,
  placeholder,
  disabled,
  error,
  help,
  width,
  onChange,
  onBlur,
  theme,
  children,
}) => {
  const widthStyle = typeof width === 'number' ? `${width}px` : width

  return (
    <Wrapper width={widthStyle}>
      <LabelHead theme={theme}>
        <Title theme={theme}>
          {label}
          {required && (
            <TagWrapper theme={theme}>
              <Tag type="required">必須</Tag>
            </TagWrapper>
          )}
        </Title>
        {help && <Help theme={theme}>{help}</Help>}
      </LabelHead>
      {InputComponent ? (
        <InputComponent
          value={value}
          name={name}
          required={required}
          placeholder={placeholder}
          disabled={disabled}
          error={!!error}
          width={width}
          onChange={onChange}
          onBlur={onBlur}
        />
      ) : (
        children
      )}
      {error && <Error theme={theme}>{error}</Error>}
    </Wrapper>
  )
}

export const Field = withTheme(fieldFactory())
export const TextField = withTheme(fieldFactory(TextInput))
export const NumberField = withTheme(fieldFactory(NumberInput))
export const PasswordField = withTheme(fieldFactory(PasswordInput))

const Wrapper: any = styled.div`
  display: inline-block;
  width: ${({ width }: { width: string }) => width};
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

const TagWrapper = styled.span`
  ${({ theme }: InjectedProps) => css`
    margin-left: ${theme.size.pxToRem(theme.size.space.XXS)};
  `}
`
