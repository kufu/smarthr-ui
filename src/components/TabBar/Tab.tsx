import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { isTouchDevice } from '../../libs/ua'

export interface Props {
  id: string
  label: string
  active?: boolean
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
  active = false,
  className = '',
  ...props
}) => {
  const classNames = `${className} ${active ? 'active' : ''}`

  const handleClick = () => {
    onClick(id)
  }

  return (
    <Wrapper
      role="tab"
      aria-selected={active}
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

const buttonReseter = css`
  background-color: transparent;
  border: none;
  cursor: pointer;
  outline: none;
  padding: 0;
  appearance: none;
`

const Wrapper = styled.button`
  ${buttonReseter}
  ${({ theme }: InjectedProps) => {
    const { size, palette, interaction } = theme
    return css`
      font-weight: bold;
      font-size: ${size.pxToRem(size.font.TALL)};
      color: ${palette.TEXT_GREY};
      border-bottom: solid 3px transparent;
      padding: ${size.pxToRem(size.space.XXS)} ${size.pxToRem(size.space.S)};
      box-sizing: border-box;
      transition: ${isTouchDevice ? 'none' : `background-color ${interaction.hover.animation}`};
      margin-bottom: -1px;

      &.active {
        color: ${palette.TEXT_BLACK};
        border-color: ${palette.MAIN};
      }

      :hover {
        background-color: ${palette.COLUMN};
      }

      :disabled {
        color: #c1c1c1;
        pointer-events: none;
      }
    `
  }}
`
