import React, { HTMLAttributes, PropsWithChildren } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { Text } from '../Text'

const definedColors = ['MAIN', 'DANGER'] as const
type DefinedColor = (typeof definedColors)[number]

type BaseProps = PropsWithChildren<{
  count?: number
  overflowCount?: number
  showZero?: boolean
  type?: 'dot'
  color?: DefinedColor
}>
type BadgeProps = Omit<HTMLAttributes<HTMLElement>, keyof BaseProps> & BaseProps

export const Badge: React.FC<BadgeProps> = ({
  count,
  overflowCount = 99,
  showZero = false,
  type,
  color = 'MAIN',
  children,
  ...props
}) => {
  const theme = useTheme()

  const actualCount = count && count > 0 ? count : showZero ? 0 : undefined
  const displayDot = type === 'dot'
  const badgeProps = {
    themes: theme,
    colorName: color,
    withChildren: !!children,
  }

  if (!displayDot && !children && actualCount === undefined) return null

  return (
    <BadgeWrapper {...props}>
      {children}
      {displayDot ? (
        <Dot {...badgeProps} />
      ) : (
        actualCount !== undefined && (
          <Pill {...badgeProps}>
            {actualCount > overflowCount ? `${overflowCount}+` : actualCount}
          </Pill>
        )
      )}
    </BadgeWrapper>
  )
}

const BadgeWrapper = styled.span`
  position: relative;
  display: inline-flex;
  display: flex;
`
const badgeBaseStyle = css<{ themes: Theme; colorName: DefinedColor; withChildren: boolean }>`
  ${({ themes: { color, radius }, colorName, withChildren }) => css`
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

    box-shadow: 0 0 0 1px ${color.WHITE};
    border-radius: ${radius.full};
    background-color: ${color[colorName]};
  `}
`
const Pill = styled(Text).attrs({
  size: 'XS',
})<{ themes: Theme; colorName: DefinedColor; withChildren: boolean }>`
  ${({ themes: { color } }) => css`
    ${badgeBaseStyle}

    padding-inline: 0.5em;
    font-variant-numeric: tabular-nums;
    color: ${color.WHITE};
    min-width: 1.75em;
    height: 1.75em;
  `}
`
const Dot = styled.span<{ themes: Theme; colorName: DefinedColor; withChildren: boolean }>`
  ${badgeBaseStyle}

  width: 0.625em;
  height: 0.625em;
`
