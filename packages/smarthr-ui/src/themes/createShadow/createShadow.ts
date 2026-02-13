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

// 将来的になんらか別のデザイントークンに移行したい
const createFocusIndicatorStyles = (outlineColor: string) => css`
  /* stylelint-disable no-invalid-position-declaration */
  isolation: isolate;
  box-shadow: 0 0 0 2px white;
  outline: 2px solid ${outlineColor};
  outline-offset: 2px;
  /* stylelint-enable no-invalid-position-declaration */
`

export const createShadow = (
  userShadow?: ShadowProperty,
  userColor?: ColorProperty,
): CreatedShadowTheme => {
  const outlineColor = userColor?.OUTLINE || defaultColor.OUTLINE
  const outline = createOutline(outlineColor)
  const shadows = {
    ...defaultShadow,
    OUTLINE: outline,
    focusIndicatorStyles: createFocusIndicatorStyles(outlineColor),
  }

  if (!userShadow) {
    return shadows
  }

  return merge(shadows, userShadow)
}
