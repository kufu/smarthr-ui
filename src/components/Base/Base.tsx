import React, { HTMLAttributes, ReactNode, forwardRef, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'
import { useSpacing } from '../../hooks/useSpacing'
import { Gap } from '../Layout'

type Props = {
  children: ReactNode
  /** 境界とコンテンツの間の余白 */
  padding?: Gap | SeparatePadding
  /** 角丸のサイズ */
  radius?: 's' | 'm'
  /** レイヤの重なり方向の高さ（影の付き方に影響する） */
  layer?: LayerKeys
}

export type LayerKeys = keyof typeof layerMap

export const layerMap = {
  0: 'LAYER0',
  1: 'LAYER1',
  2: 'LAYER2',
  3: 'LAYER3',
  4: 'LAYER4',
} as const

type SeparatePadding = {
  block?: Gap
  inline?: Gap
}

export type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

const separatePadding = (padding: Props['padding']) => {
  if (padding instanceof Object) {
    return {
      block: padding.block,
      inline: padding.inline,
    }
  }

  return {
    block: padding,
    inline: padding,
  }
}

export const Base = forwardRef<HTMLDivElement, Props & ElementProps>(
  ({ padding, radius = 'm', layer = 1, className = '', ...props }, ref) => {
    const themes = useTheme()
    const classNames = useClassNames()

    const $padding = separatePadding(padding)
    const $radius = useMemo(() => {
      switch (radius) {
        case 's':
          return themes.radius.m
        case 'm':
          return themes.radius.l
      }
    }, [radius, themes.radius.l, themes.radius.m])

    return (
      <Wrapper
        {...props}
        className={`${className} ${classNames.base.wrapper}`}
        themes={themes}
        $padding={$padding}
        $radius={$radius}
        $layer={layerMap[layer]}
        ref={ref}
      />
    )
  },
)

const Wrapper = styled.div<{
  themes: Theme
  $padding: { block?: Gap; inline?: Gap }
  $radius: string
  $layer: typeof layerMap[LayerKeys]
}>`
  ${({ themes: { color, shadow }, $padding, $radius, $layer }) => css`
    box-shadow: ${shadow[$layer]};
    border-radius: ${$radius};
    background-color: ${color.WHITE};
    ${$padding.block && `padding-block: ${useSpacing($padding.block)};`}
    ${$padding.inline && `padding-inline: ${useSpacing($padding.inline)};`}
  `}
`
