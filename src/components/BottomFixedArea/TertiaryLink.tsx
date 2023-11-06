import React, { HTMLAttributes, ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { ComponentProps as IconProps } from '../Icon'

import { useClassNames } from './useClassNames'

type ElementProps = Omit<HTMLAttributes<HTMLButtonElement>, keyof Props>

type Props = {
  text: ReactNode
  icon?: React.ComponentType<IconProps>
  type?: 'button' | 'reset'
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export const TertiaryLink: VFC<Props & ElementProps> = ({
  text,
  icon: Icon,
  type = 'button',
  onClick,
  ...props
}) => {
  const theme = useTheme()
  const classNames = useClassNames()

  return (
    <Button
      {...props}
      onClick={onClick}
      themes={theme}
      type={type}
      className={classNames.tertiaryLink}
    >
      {Icon && <Icon />}
      <Text themes={theme}>{text}</Text>
    </Button>
  )
}

const resetButtonStyle = css`
  background-color: transparent;
  border: none;
  padding: 0;
  appearance: none;
`

const Button = styled.button<{ themes: Theme }>`
  ${resetButtonStyle}
  ${({ themes }) => {
    const { spacingByChar } = themes

    return css`
      color: ${themes.color.TEXT_LINK};
      display: flex;
      align-items: center;

      &:hover {
        text-decoration: underline;
        cursor: pointer;
      }

      > svg {
        margin-right: ${spacingByChar(0.25)};
      }
    `
  }}
`
const Text = styled.span<{ themes: Theme }>`
  ${({ themes: { fontSize } }) => css`
    margin: 0;
    font-size: ${fontSize.L};
  `}
`
