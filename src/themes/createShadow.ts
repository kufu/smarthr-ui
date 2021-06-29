import { FlattenSimpleInterpolation, css } from 'styled-components'
import { merge } from '../libs/lodash'
import { defaultColor } from './createColor'

export interface ShadowProperty {
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
}

export interface CreatedShadowTheme {
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
  focusIndicatorStyles: FlattenSimpleInterpolation
}

const defaultOutline = `0 0 0 2px white, 0 0 0 4px ${defaultColor.OUTLINE}`

export const defaultShadow = {
  BASE: 'rgba(51, 51, 51, 0.15) 0 0 4px 0',
  DIALOG: 'rgba(51, 51, 51, 0.3) 0 4px 10px 0',
  LAYER0: 'none',
  LAYER1: '0 1px 2px 0 rgba(0,0,0,0.24)',
  LAYER2: '0 2px 4px 1px rgba(0,0,0,0.24)',
  LAYER3: '0 4px 8px 2px rgba(0,0,0,0.24)',
  LAYER4: '0 8px 16px 4px rgba(0,0,0,0.24)',
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
