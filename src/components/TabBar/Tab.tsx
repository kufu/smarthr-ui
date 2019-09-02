import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { isTouchDevice } from '../../libs/ua'

export interface Props {
  id: string
  label: string
  selected?: boolean
  disabled?: boolean
  className?: string
  onClick: (tabId: string) => void
}

type MergedProps = Props & InjectedProps

const TabComponent: React.FC<MergedProps> = ({
  id,
  label,
  onClick,
  theme,
  selected = false,
  className = '',
  ...props
}) => {
  const classNames = `${className} ${selected ? 'selected' : ''}`

  const handleClick = () => {
    onClick(id)
  }

  return (
    <Wrapper
      role="tab"
      aria-selected={selected}
      className={classNames}
      onClick={handleClick}
      theme={theme}
      {...props}
    >
      {label}
    </Wrapper>
  )
}

export const Tab = withTheme(TabComponent)

const resetButtonStyle = css`
  background-color: transparent;
  border: none;
  cursor: pointer;
  outline: none;
  padding: 0;
  appearance: none;
`

const Wrapper = styled.button`
  ${resetButtonStyle}
  ${({ theme }: InjectedProps) => {
    const { size, palette, interaction } = theme
    return css`
      font-weight: bold;
      font-size: ${size.pxToRem(size.font.TALL)};
      color: ${palette.TEXT_GREY};
      height: 40px;
      margin-bottom: -1px;
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
