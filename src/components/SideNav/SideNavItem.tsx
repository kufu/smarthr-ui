import React, { ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { isTouchDevice } from '../../libs/ua'
import { UnstyledButton } from '../Button'
import { useClassNames } from './useClassNames'

export type SideNavSizeType = 'default' | 's'
export type OnClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => void

type Props = {
  id: string
  title: string
  prefix?: ReactNode
  isSelected?: boolean
  size?: SideNavSizeType
  onClick?: OnClick
}

export const SideNavItem: VFC<Props> = ({
  id,
  title,
  prefix,
  isSelected = false,
  size,
  onClick,
}) => {
  const theme = useTheme()
  const classNames = useClassNames()
  const handleClick = onClick
    ? (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onClick(e, id)
    : undefined

  const itemClassName = `${isSelected ? 'selected' : ''} ${classNames.item}`
  return (
    <Wrapper className={itemClassName} themes={theme}>
      <Button className={size} themes={theme} onClick={handleClick}>
        {prefix && <PrefixWrapper themes={theme}>{prefix}</PrefixWrapper>}
        <span className={classNames.itemTitle}>{title}</span>
      </Button>
    </Wrapper>
  )
}

const Wrapper = styled.li<{ themes: Theme }>`
  ${({ themes }) => {
    const { color, interaction, shadow } = themes

    return css`
      color: ${color.TEXT_BLACK};
      transition: ${isTouchDevice
        ? 'none'
        : `background-color ${interaction.hover.animation}, color ${interaction.hover.animation}`};

      &:hover {
        background-color: ${color.hoverColor(color.COLUMN)};
      }

      &.selected {
        background-color: ${color.MAIN};
        color: ${color.TEXT_WHITE};
        position: relative;

        &::after {
          position: absolute;
          top: 50%;
          right: -4px;
          transform: translate(0, -50%);
          border-style: solid;
          border-width: 4px 0 4px 4px;
          border-color: transparent transparent transparent ${color.MAIN};
          content: '';
        }
      }

      &:focus-within {
        ${shadow.focusIndicatorStyles}
      }
    `
  }}
`

const Button = styled(UnstyledButton)<{ themes: Theme }>`
  ${({ themes }) => {
    const { fontSize, spacingByChar } = themes

    return css`
      outline: none;
      width: 100%;
      line-height: 1;
      box-sizing: border-box;
      cursor: pointer;

      &.default {
        padding: ${spacingByChar(1)};
        font-size: ${fontSize.M};
      }

      &.s {
        padding: ${spacingByChar(0.5)} ${spacingByChar(1)};
        font-size: ${fontSize.S};
      }
    `
  }}
`
const PrefixWrapper = styled.span<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => {
    return css`
      margin-right: ${spacingByChar(0.5)};
    `
  }}
`
