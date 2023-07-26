import React, { ButtonHTMLAttributes, ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { isTouchDevice } from '../../libs/ua'

import { useClassNames } from './useClassNames'

type Props = {
  /** タブの ID */
  id: string
  /** タブの内容 */
  children: ReactNode
  /** `true` のとき、タブが選択状態のスタイルになる */
  selected?: boolean
  /** `true` のとき、タブを無効状態にしてクリック不能にする */
  disabled?: boolean
  /** コンポーネントに適用するクラス名 */
  className?: string
  /** タブをクリックした時に発火するコールバック関数 */
  onClick: (tabId: string) => void
}
type ElementProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  keyof Props | 'role' | 'aria-selected' | 'type'
>

export const TabItem: VFC<Props & ElementProps> = ({
  id,
  children,
  onClick,
  selected = false,
  className = '',
  disabled = false,
  ...props
}) => {
  const theme = useTheme()
  const classNames = useClassNames().tabItem
  const wrapperClass = `${className} ${selected ? 'selected' : ''} ${classNames.wrapper}`

  return (
    <ItemButton
      {...props}
      id={id}
      role="tab"
      aria-selected={selected}
      className={wrapperClass}
      onClick={() => onClick(id)}
      disabled={disabled}
      themes={theme}
      type="button"
    >
      {children}
    </ItemButton>
  )
}

const resetButtonStyle = css`
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  appearance: none;
`

const borderWidth = 3
const ItemHeight = 40

const ItemButton = styled.button<{ themes: Theme }>`
  ${resetButtonStyle}
  ${({ themes }) => {
    const { fontSize, spacingByChar, color, interaction } = themes
    return css`
      font-weight: bold;
      font-size: ${fontSize.M};
      color: ${color.TEXT_GREY};
      height: ${ItemHeight + borderWidth}px;
      padding: 0 ${spacingByChar(1.5)};
      box-sizing: border-box;
      transition: ${isTouchDevice
        ? 'none'
        : `background-color ${interaction.hover.animation}, color ${interaction.hover.animation}`};

      &.selected {
        position: relative;
        color: ${color.TEXT_BLACK};
        height: ${ItemHeight}px;
        border-bottom: solid ${borderWidth}px ${color.MAIN};
      }

      :hover {
        background-color: ${color.COLUMN};
        color: ${color.TEXT_BLACK};
      }

      :disabled {
        background-color: transparent;
        color: ${color.disableColor(color.TEXT_GREY)};
        cursor: not-allowed;
      }
    `
  }}
`
