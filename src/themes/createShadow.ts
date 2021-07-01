import { FlattenSimpleInterpolation, css } from 'styled-components'
import { merge } from '../libs/lodash'
import { defaultColor } from './createColor'

export interface ShadowProperty {
  BASE?: string
  DIALOG?: string
  OUTLINE?: string
}

export interface CreatedShadowTheme {
  BASE: string
  DIALOG: string
  OUTLINE: string
  focusIndicatorStyles: FlattenSimpleInterpolation
}

const defaultOutline = `0 0 0 2px white, 0 0 0 4px ${defaultColor.OUTLINE}`

export const defaultShadow = {
  BASE: 'rgba(51, 51, 51, 0.15) 0 0 4px 0',
  DIALOG: 'rgba(51, 51, 51, 0.3) 0 4px 10px 0',
  OUTLINE: defaultOutline,
}

function createFocusIndicatorStyles(outline?: string) {
  return css`
    outline: none;
    isolation: isolate;
    box-shadow: ${outline || defaultOutline};
  `
}

export const createShadow = (userShadow: ShadowProperty = {}) => {
  const created: CreatedShadowTheme = merge(
    { ...defaultShadow, focusIndicatorStyles: createFocusIndicatorStyles(userShadow.OUTLINE) },
    userShadow,
  )
  return created
}
