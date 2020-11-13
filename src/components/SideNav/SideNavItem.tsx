import React, { FC, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { isTouchDevice } from '../../libs/ua'
import { ResetButton } from '../Button/ResetButton'

export type SideNavItemProps = {
  id: string
  title: string
  prefix?: ReactNode
  isSelected?: boolean
}

export type SideNavSizeType = 'default' | 's'

export type OnClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => void

type Props = SideNavItemProps & {
  size?: SideNavSizeType
  onClick?: OnClick
}

export const SideNavItem: FC<Props> = ({
  id,
  title,
  prefix,
  isSelected = false,
  size,
  onClick,
}) => {
  const theme = useTheme()
  const handleClick = onClick
    ? (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onClick(e, id)
    : undefined

  return (
    <Wrapper className={isSelected ? 'selected' : ''} themes={theme}>
      <Button className={size} themes={theme} onClick={handleClick}>
        {prefix && <span>{prefix}</span>}
        {title}
      </Button>
    </Wrapper>
  )
}

const Wrapper = styled.li<{ themes: Theme }>`
  ${({ themes }) => {
    const { palette, interaction } = themes

    return css`
      color: ${palette.TEXT_BLACK};
      transition: ${isTouchDevice
        ? 'none'
        : `background-color ${interaction.hover.animation}, color ${interaction.hover.animation}`};

      &:hover {
        background-color: ${palette.hoverColor(palette.COLUMN)};
      }

      &.selected {
        background-color: ${palette.MAIN};
        color: #fff;
        position: relative;

        &::after {
          position: absolute;
          top: 50%;
          right: -4px;
          transform: translate(0, -50%);
          border-style: solid;
          border-width: 4px 0 4px 4px;
          border-color: transparent transparent transparent ${palette.MAIN};
          content: '';
        }
      }
    `
  }}
`

const Button = styled(ResetButton)<{ themes: Theme }>`
  ${({ themes }) => {
    const { size } = themes

    return css`
      width: 100%;
      line-height: 1;
      box-sizing: border-box;

      &.default {
        padding: ${size.pxToRem(size.space.XS)};
        font-size: ${size.pxToRem(size.font.TALL)};
      }

      &.s {
        padding: ${size.pxToRem(size.space.XXS)} ${size.pxToRem(size.space.XS)};
        font-size: ${size.pxToRem(size.font.SHORT)};
      }
    `
  }}
`
