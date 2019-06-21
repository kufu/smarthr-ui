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
      <label>
        <LabelHead theme={theme}>
          <Title theme={theme}>
            {label}
            {required && (
              <TagWrapper>
                <Tag type="require">必須</Tag>
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
      </label>
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
    margin-bottom: ${theme.size.pxToRem(theme.size.space.xxs)};
    line-height: 1.4;
  `}
`
const Title = styled.p`
  ${({ theme }: InjectedProps) => css`
    margin: 0;
    color: ${theme.palette.Mono_P80};
    font-weight: bold;
    font-size: ${theme.size.pxToRem(theme.size.font.tall)};
  `}
`
const Help = styled.p`
  ${({ theme }: InjectedProps) => css`
    margin: 0;
    color: ${theme.palette.Mono_P60};
    font-size: ${theme.size.pxToRem(theme.size.font.tasting)};
  `}
`
const Error = styled.p`
  ${({ theme }: InjectedProps) => css`
    margin: ${theme.size.pxToRem(theme.size.space.xxs)} 0 0 0;
    color: ${theme.palette.Red};
    font-size: ${theme.size.pxToRem(theme.size.font.tall)};
    line-height: 1.4;
  `}
`

const TagWrapper = styled.span`
  margin-left: 8px;
`
