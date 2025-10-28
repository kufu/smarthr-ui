import { type FlattenSimpleInterpolation, css } from 'styled-components'

import { defaultColor } from './createColor'

export type OutlineProperty = {
  OUTLINE?: string
}

export type CreatedOutlineTheme = {
  OUTLINE: FlattenSimpleInterpolation
  focusIndicatorStyles: FlattenSimpleInterpolation
}

const createOutlineStyles = (color: string) => css`
  outline: 2px solid ${color};
  outline-offset: -2px;
  box-shadow: inset 0 0 0 2px white;
`

export const defaultOutline = {
  OUTLINE: createOutlineStyles(defaultColor.OUTLINE),
}

export const createOutline = (userOutline?: OutlineProperty): CreatedOutlineTheme => {
  const outline = userOutline?.OUTLINE || defaultColor.OUTLINE
  return {
    OUTLINE: createOutlineStyles(outline),
    focusIndicatorStyles: createOutlineStyles(outline),
  }
}
