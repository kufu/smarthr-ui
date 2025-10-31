import { type FlattenSimpleInterpolation, css } from 'styled-components'

import { defaultColor } from './createColor'

export type OutlineProperty = {
  OUTLINE?: string
}

export type CreatedOutlineTheme = {
  OUTLINE: FlattenSimpleInterpolation
  focusIndicatorStyles: FlattenSimpleInterpolation
  innerFocusIndicatorStyles: FlattenSimpleInterpolation
}

const createOuterOutlineStyles = (color: string) => css`
  outline: 2px solid ${color};
  outline-offset: 2px;
  isolation: isolate;
  box-shadow: 0 0 0 2px white;
`

const createInnerOutlineStyles = (color: string) => css`
  outline: 2px solid ${color};
  outline-offset: -2px;
  isolation: isolate;

  /** outline は border の外側から生えるが、box-shadow は border の内側から生えるため、border の幅を引いている */
  box-shadow: inset 0 0 0 3px white;
`

export const createOutline = (userOutline?: OutlineProperty): CreatedOutlineTheme => {
  const outlineColor = userOutline?.OUTLINE || defaultColor.OUTLINE
  return {
    OUTLINE: createOuterOutlineStyles(outlineColor),
    focusIndicatorStyles: createOuterOutlineStyles(outlineColor),
    innerFocusIndicatorStyles: createInnerOutlineStyles(outlineColor),
  }
}
export const defaultOutline = createOutline()
