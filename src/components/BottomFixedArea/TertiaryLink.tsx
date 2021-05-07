import React, { HTMLAttributes, VFC } from 'react'
import styled, { css } from 'styled-components'
import { ComponentProps as IconProps } from '../Icon'
import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

type ElementProps = Omit<HTMLAttributes<HTMLButtonElement>, keyof Props>

type Props = {
  text: string
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
      onClick={onClick}
      themes={theme}
      type={type}
      className={classNames.tertiaryLink}
      {...props}
    >
      {Icon && <Icon size={14} />}
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
    const { pxToRem } = themes.size

    return css`
      color: ${themes.palette.TEXT_LINK};
      display: flex;
      align-items: center;

      &:hover {
        text-decoration: underline;
        cursor: pointer;
      }

      > svg {
        margin-right: ${pxToRem(4)};
      }
    `
  }}
`
const Text = styled.span<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, font } = themes.size
    return css`
      margin: 0;
      font-size: ${pxToRem(font.GRANDE)};
    `
  }}
`
