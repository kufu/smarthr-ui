import React, { HTMLAttributes, ReactNode, forwardRef } from 'react'
import styled, { css } from 'styled-components'
import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

type Props = {
  children: ReactNode
  radius?: RadiusKeys
  layer?: LayerKeys
}
type RadiusKeys = keyof typeof radiusMap

type LayerKeys = keyof typeof shadowMap

export const radiusMap = {
  s: '6px',
  m: '8px',
} as const

const shadowMap = {
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
        $layer={shadowMap[layer]}
        ref={ref}
        {...props}
      />
    )
  },
)

const Wrapper = styled.div<{
  themes: Theme
  $radius: typeof radiusMap[RadiusKeys]
  $layer: typeof shadowMap[LayerKeys]
}>`
  ${({ themes, $radius, $layer }) => {
    return css`
      box-shadow: ${themes.shadow[$layer]};
      border-radius: ${$radius};
      background-color: #fff;
    `
  }}
`
