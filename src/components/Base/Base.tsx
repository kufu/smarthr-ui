import React, { HTMLAttributes, ReactNode, forwardRef } from 'react'
import styled, { css } from 'styled-components'
import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

type Props = {
  children: ReactNode
  /** 角丸のサイズ */
  radius?: RadiusKeys
  /** レイヤの重なり方向の高さ（影の付き方に影響する） */
  layer?: LayerKeys
}

export type RadiusKeys = keyof typeof radiusMap
export type LayerKeys = keyof typeof layerMap

export const radiusMap = {
  s: '6px',
  m: '8px',
} as const

export const layerMap = {
  0: 'LAYER0',
  1: 'LAYER1',
  2: 'LAYER2',
  3: 'LAYER3',
  4: 'LAYER4',
} as const

export type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

export const Base = forwardRef<HTMLDivElement, Props & ElementProps>(
  ({ radius = 'm', layer = 1, className = '', ...props }, ref) => {
    const themes = useTheme()
    const classNames = useClassNames()

    return (
      <Wrapper
        className={`${className} ${classNames.base.wrapper}`}
        themes={themes}
        $radius={radiusMap[radius]}
        $layer={layerMap[layer]}
        ref={ref}
        {...props}
      />
    )
  },
)

const Wrapper = styled.div<{
  themes: Theme
  $radius: typeof radiusMap[RadiusKeys]
  $layer: typeof layerMap[LayerKeys]
}>`
  ${({ themes: { color, shadow }, $radius, $layer }) => {
    return css`
      box-shadow: ${shadow[$layer]};
      border-radius: ${$radius};
      background-color: ${color.WHITE};
    `
  }}
`
