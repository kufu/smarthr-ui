import React, { HTMLAttributes, ReactNode, forwardRef, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

type Props = {
  children: ReactNode
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

export type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

export const Base = forwardRef<HTMLDivElement, Props & ElementProps>(
  ({ radius = 'm', layer = 1, className = '', ...props }, ref) => {
    const themes = useTheme()
    const classNames = useClassNames()
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
        className={`${className} ${classNames.base.wrapper}`}
        themes={themes}
        $radius={$radius}
        $layer={layerMap[layer]}
        ref={ref}
        {...props}
      />
    )
  },
)

const Wrapper = styled.div<{
  themes: Theme
  $radius: string
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
