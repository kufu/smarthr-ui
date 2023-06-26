import React, { CSSProperties, HTMLAttributes, PropsWithChildren, forwardRef, useMemo } from 'react'
import styled, { css } from 'styled-components'

import { useSpacing } from '../../hooks/useSpacing'
import { Theme, useTheme } from '../../hooks/useTheme'

import { useClassNames } from './useClassNames'

import type { Gap } from '../../types'

type Props = PropsWithChildren<{
  /** 境界とコンテンツの間の余白 */
  padding?: Gap | SeparatePadding
  /** 角丸のサイズ */
  radius?: 's' | 'm'
  /** コンテンツが要素内に収まらない場合の処理方法 */
  overflow?:
    | CSSProperties['overflow']
    | { x: CSSProperties['overflowX']; y: CSSProperties['overflowY'] }
  /** レイヤの重なり方向の高さ（影の付き方に影響する） */
  layer?: LayerKeys
}>

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
  ({ padding, radius = 'm', overflow, layer = 1, className = '', ...props }, ref) => {
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
        $overflow={overflow}
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
  $overflow: Props['overflow']
  $layer: (typeof layerMap)[LayerKeys]
}>`
  ${({ themes: { border, color, shadow }, $padding, $radius, $overflow, $layer }) => css`
    box-shadow: ${shadow[$layer]};
    border-radius: ${$radius};
    background-color: ${color.WHITE};
    @media (prefers-contrast: more) {
      & {
        border: ${border.highContrast};
      }
    }

    ${$padding.block && `padding-block: ${useSpacing($padding.block)};`}
    ${$padding.inline && `padding-inline: ${useSpacing($padding.inline)};`}
    ${$overflow &&
    ($overflow instanceof Object
      ? css`
          overflow-x: ${$overflow.x};
          overflow-y: ${$overflow.y};
        `
      : css`
          overflow: ${$overflow};
        `)}
  `}
`
