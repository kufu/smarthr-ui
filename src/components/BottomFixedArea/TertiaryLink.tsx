import React, { FC } from 'react'
import styled, { css } from 'styled-components'

import { iconMap, Icon } from '../Icon'
import { Theme, useTheme } from '../../hooks/useTheme'

type Props = {
  text: string
  iconName?: keyof typeof iconMap
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export const TertiaryLink: FC<Props> = ({ text, iconName, onClick }) => {
  const theme = useTheme()
  return (
    <Button onClick={onClick} themes={theme}>
      {iconName && <Icon name={iconName} />}
      <p>{text}</p>
    </Button>
  )
}

const resetButtonStyle = css`
  background-color: transparent;
  border: none;
  outline: none;
  padding: 0;
  appearance: none;
`

const Button = styled.button<{ themes: Theme }>`
  ${resetButtonStyle}
  ${({ themes }) => {
    const { pxToRem, font } = themes.size

    return css`
      color: #007bc2;
      font-size: ${pxToRem(font.GRANDE)};
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
