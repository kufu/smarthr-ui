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
      type="button"
    >
      {children}
    </Wrapper>
  )
}

const resetButtonStyle = css`
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  appearance: none;
`
const Wrapper = styled.button<{ themes: Theme }>`
  ${resetButtonStyle}
  ${({ themes }) => {
    const { size, spacingByChar, palette, interaction } = themes
    return css`
      font-weight: bold;
      font-size: ${size.pxToRem(size.font.TALL)};
      color: ${palette.TEXT_GREY};
      height: 40px;
      border-bottom: solid 3px transparent;
      padding: 0 ${spacingByChar(1.5)};
      box-sizing: border-box;
      transition: ${isTouchDevice
        ? 'none'
        : `background-color ${interaction.hover.animation}, color ${interaction.hover.animation}`};

      &.selected {
        position: relative;
        color: ${palette.TEXT_BLACK};
        border-color: ${palette.MAIN};
      }

      :hover {
        background-color: ${palette.COLUMN};
        color: ${palette.TEXT_BLACK};
      }

      :disabled {
        background-color: transparent;
        color: ${palette.disableColor(palette.TEXT_GREY)};
        cursor: not-allowed;
      }
    `
  }}
`
