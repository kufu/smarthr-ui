import { type FlattenSimpleInterpolation, css } from 'styled-components'

import { merge } from '../../libs/lodash'
import { type ColorProperty, defaultColor } from '../createColor'

import { defaultShadow } from './defaultShadow'

export type ShadowProperty = {
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

export const createShadow = (
  userShadow?: ShadowProperty,
  userColor?: ColorProperty,
): CreatedShadowTheme => {
  const outline = createOutline(userColor?.OUTLINE || defaultColor.OUTLINE)
  const shadows = {
    ...defaultShadow,
    OUTLINE: outline,
    focusIndicatorStyles: createFocusIndicatorStyles(outline),
  }

  if (!userShadow) {
    return shadows
  }

  return merge(shadows, userShadow)
}
