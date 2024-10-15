import { FlattenSimpleInterpolation, css } from 'styled-components'

import { merge } from '../../libs/lodash'
import { ColorProperty, defaultColor } from '../createColor'

import { defaultShadow } from './defaultShadow'

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
  UNDERLINE?: string
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
  UNDERLINE: string
  focusIndicatorStyles: FlattenSimpleInterpolation
}

const createOutline = (color: string) => `0 0 0 2px white, 0 0 0 4px ${color}`

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
