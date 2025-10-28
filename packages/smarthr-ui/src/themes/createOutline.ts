import { type FlattenSimpleInterpolation, css } from 'styled-components'

import { merge } from '../libs/lodash'

import { defaultColor } from './createColor'

export type OutlineProperty = {
  OUTLINE?: string
  OUTLINE_MARGIN?: string
}

export type CreatedOutlineTheme = {
  OUTLINE: string
  OUTLINE_MARGIN: string
  focusIndicatorStyles: FlattenSimpleInterpolation
}

const createFocusIndicatorStyles = (color: string) => css`
  outline: 2px solid ${color};
  outline-offset: -2px;
  box-shadow: inset 0 0 0 2px white;
`

export const defaultOutline = {
  OUTLINE: defaultColor.OUTLINE,
  OUTLINE_MARGIN: '4px',
}

export const createOutline = (userOutline?: OutlineProperty): CreatedOutlineTheme => {
  const outlineColor = userOutline?.OUTLINE || defaultColor.OUTLINE
  const outline = {
    ...defaultOutline,
    focusIndicatorStyles: createFocusIndicatorStyles(outlineColor),
  }
  if (!userOutline) {
    return outline
  }

  return merge({ ...outline }, userOutline)
}
