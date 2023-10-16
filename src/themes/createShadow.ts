import { FlattenSimpleInterpolation, css } from 'styled-components'

import { merge } from '../libs/lodash'

import { ColorProperty, defaultColor } from './createColor'

export type ShadowProperty = {
  /**
   * @deprecated The BASE property will be deprecated, please use LAYER0~4 property instead
   */
  BASE?: string
  /**
   * @deprecated The DIALOG property will be deprecated, please use LAYER0~4 property instead
   */
  DIALOG?: string
  LAYER0?: string
  LAYER1?: string
  LAYER2?: string
  LAYER3?: string
  LAYER4?: string
  OUTLINE?: string
  OUTLINE_MARGIN?: string
  LINK_UNDERLINE?: string
}

export type CreatedShadowTheme = {
  /**
   * @deprecated The BASE property will be deprecated, please use LAYER0~4 property instead
   */
  BASE: string
  /**
   * @deprecated The DIALOG property will be deprecated, please use LAYER0~4 property instead
   */
  DIALOG: string
  LAYER0?: string
  LAYER1?: string
  LAYER2?: string
  LAYER3?: string
  LAYER4?: string
  OUTLINE: string
  OUTLINE_MARGIN: string
  LINK_UNDERLINE: string
  focusIndicatorStyles: FlattenSimpleInterpolation
}

const createOutline = (color: string) => `0 0 0 2px white, 0 0 0 4px ${color}`
const defaultOutline = createOutline(defaultColor.OUTLINE)
const defaultOutlineMargin = '4px'

const createLayerShadow = (depth: number) =>
  depth === 0
    ? 'none'
    : `0 ${2 ** (depth - 1)}px ${2 ** depth}px ${depth - 1 > 0 ? `${2 ** (depth - 2)}px` : 0} ${
        defaultColor.TRANSPARENCY_30
      }`

export const defaultShadow = {
  BASE: `${defaultColor.TRANSPARENCY_15} 0 0 4px 0`,
  DIALOG: `${defaultColor.TRANSPARENCY_30} 0 4px 10px 0`,
  LAYER0: createLayerShadow(0),
  LAYER1: createLayerShadow(1),
  LAYER2: createLayerShadow(2),
  LAYER3: createLayerShadow(3),
  LAYER4: createLayerShadow(4),
  OUTLINE: defaultOutline,
  OUTLINE_MARGIN: defaultOutlineMargin,
  LINK_UNDERLINE: '0 1px 0 0'
}

const createFocusIndicatorStyles = (outline: string) => css`
  outline: none;
  isolation: isolate;
  box-shadow: ${outline};
`

export const createShadow = (userShadow: ShadowProperty = {}, userColor: ColorProperty = {}) => {
  const outline = createOutline(userColor.OUTLINE || defaultColor.OUTLINE)
  const created: CreatedShadowTheme = merge(
    {
      ...defaultShadow,
      OUTLINE: outline,
      focusIndicatorStyles: createFocusIndicatorStyles(outline),
    },
    userShadow,
  )
  return created
}
