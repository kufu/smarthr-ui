import { FlattenSimpleInterpolation, css } from 'styled-components'

import { ColorProperty, defaultColor } from '../createColor'

import { createOutline, defaultShadow } from './defaultShadow'

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

const createFocusIndicatorStyles = (outline: string) => css`
  outline: none;
  isolation: isolate;
  box-shadow: ${outline};
`

export const createShadow = (userShadow: ShadowProperty = {}, userColor: ColorProperty = {}) => {
  const userOutline = userColor.OUTLINE ? { OUTLINE: createOutline(userColor.OUTLINE) } : {}

  return {
    ...defaultShadow,
    ...userOutline,
    ...userShadow,
    focusIndicatorStyles: createFocusIndicatorStyles(outline),
  } as CreatedShadowTheme
}
