import React, { FC, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { isTouchDevice } from '../../libs/ua'

type Props = {
  id: string
  children: ReactNode
  selected?: boolean
  disabled?: boolean
  className?: string
  onClick: (tabId: string) => void
}

export const TabItem: FC<Props> = ({
  id,
  children,
  onClick,
  selected = false,
  className = '',
  disabled = false,
}) => {
  const theme = useTheme()
  const classNames = `${className} ${selected ? 'selected' : ''}`

  return (
    <Wrapper
      role="tab"
      aria-selected={selected}
      className={classNames}
      onClick={() => onClick(id)}
      disabled={disabled}
      themes={theme}
    >
      {children}
    </Wrapper>
  )
}

const resetButtonStyle = css`
  background-color: transparent;
  border: none;
  cursor: pointer;
  outline: none;
  padding: 0;
  appearance: none;
`
const Wrapper = styled.button<{ themes: Theme }>`
  ${resetButtonStyle}
  ${({ themes }) => {
    const { size, palette, interaction } = themes
    return css`
      font-weight: bold;
      font-size: ${size.pxToRem(size.font.TALL)};
      color: ${palette.TEXT_GREY};
      height: 40px;
      border-bottom: solid 3px transparent;
      padding: 0 ${size.pxToRem(size.space.S)};
      box-sizing: border-box;
      transition: ${isTouchDevice
        ? 'none'
        : `background-color ${interaction.hover.animation}, color ${interaction.hover.animation}`};

      &.selected {
        color: ${palette.TEXT_BLACK};
        border-color: ${palette.MAIN};
      }

      :hover {
        background-color: ${palette.COLUMN};
        color: ${palette.TEXT_BLACK};
      }

      :disabled {
        background-color: inherit;
        color: ${palette.disableColor(palette.TEXT_GREY)};
        cursor: not-allowed;
      }
    `
  }}
`
