import React, { VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

type Props = {
  length: number
  onClick: () => void
}

export const HeaderNotification: VFC<Props> = ({ length, onClick }) => {
  const theme = useTheme()

  return (
    <Wrapper themes={theme}>
      <Button
        isZero={length === 0}
        onClick={onClick}
        aria-label="通知履歴"
        themes={theme}
        type="button"
      >
        {length >= 10 ? '9+' : length}
      </Button>
    </Wrapper>
  )
}

const Wrapper = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem } = themes.size

    return css`
      display: flex;
      align-items: center;
      padding: 0 ${pxToRem(10)};
    `
  }}
`
const Button = styled.button<{ themes: Theme; isZero: boolean }>`
  ${({ themes, isZero }) => {
    const { size, interaction } = themes

    return css`
      display: inline-block;
      width: 29px;
      height: 29px;
      padding: 0;
      border: none;
      border-radius: 4px;
      background-color: ${isZero ? '#aaa' : '#fcb156'};
      color: #fff;
      font-size: ${size.pxToRem(size.font.TALL)};
      transition: background-color ${interaction.hover.animation};
      cursor: pointer;

      &:hover {
        background-color: ${isZero ? '#aaa' : '#ffc77b'};
      }
    `
  }}
`
