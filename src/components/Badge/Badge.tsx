import React, { HTMLAttributes, PropsWithChildren } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { Text } from '../Text'

const definedColors = {
  grey: 'TEXT_GREY',
  blue: 'MAIN',
  yellow: 'WARNING_YELLOW',
  red: 'DANGER',
} as const
type Color = keyof typeof definedColors
type ColorName = (typeof definedColors)[Color]

type BaseProps = PropsWithChildren<{
  /** 件数 */
  count?: number
  /** 最大表示件数。この数を超えた場合は{最大表示件数+}と表示される */
  overflowCount?: number
  /** 0値を表示するかどうか */
  showZero?: boolean
  /** 色の種類 */
  type?: Color
  /** ドット表示するかどうか */
  dot?: boolean
}>
type BadgeProps = Omit<HTMLAttributes<HTMLElement>, keyof BaseProps> & BaseProps

export const Badge: React.FC<BadgeProps> = ({
  count,
  overflowCount = 99,
  showZero = false,
  type = 'blue',
  dot = false,
  children,
  ...props
}) => {
  const theme = useTheme()

  const actualCount = count && count > 0 ? count : showZero ? 0 : undefined
  const badgeProps = {
    themes: theme,
    $colorName: definedColors[type],
    withChildren: !!children,
  }

  // ドット表示でもなく、0値を表示するでもない場合は何も表示しない
  if (!dot && !children && actualCount === undefined) return null

  return (
    <BadgeWrapper {...props}>
      {children}
      {dot ? (
        <Dot {...badgeProps} />
      ) : (
        actualCount !== undefined && (
          <PillText {...badgeProps}>
            {actualCount > overflowCount ? `${overflowCount}+` : actualCount}
          </PillText>
        )
      )}
    </BadgeWrapper>
  )
}

const BadgeWrapper = styled.span`
  position: relative;
  display: inline-flex;
`
const badgeBaseStyle = css<{ themes: Theme; $colorName: ColorName; withChildren: boolean }>`
  ${({ themes: { color, radius }, $colorName, withChildren }) => css`
    ${withChildren &&
    css`
      position: absolute;
      inset-block-start: 0;
      inset-inline-end: 0;
      translate: 50% -50%;
    `}

    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;

    box-shadow: 0 0 0 1px ${$colorName === 'WARNING_YELLOW' ? color.TEXT_BLACK : color.WHITE};
    border-radius: ${radius.full};
    background-color: ${color[$colorName]};
  `}
`
const PillText = styled(Text).attrs({
  size: 'XS',
})<{ themes: Theme; $colorName: ColorName; withChildren: boolean }>`
  ${({ themes: { color }, $colorName }) => css`
    ${badgeBaseStyle}

    padding-inline: 0.5em;
    font-variant-numeric: tabular-nums;
    color: ${$colorName === 'WARNING_YELLOW' ? color.TEXT_BLACK : color.WHITE};
    min-width: 1.75em;
    height: 1.75em;
  `}
`
const Dot = styled.span<{ themes: Theme; $colorName: ColorName; withChildren: boolean }>`
  ${badgeBaseStyle}

  width: 0.625em;
  height: 0.625em;
`
