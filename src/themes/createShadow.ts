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
  OUTLINE_MARGIN?: string
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
  OUTLINE_MARGIN: string
  focusIndicatorStyles: FlattenSimpleInterpolation
}

const defaultOutline = `0 0 0 2px white, 0 0 0 4px ${defaultColor.OUTLINE}`
const defaultOutlineMargin = '4px'

export const defaultShadow = {
  BASE: `${defaultColor.TRANSPARENCY_15} 0 0 4px 0`,
  DIALOG: `${defaultColor.TRANSPARENCY_30} 0 4px 10px 0`,
  LAYER0: 'none',
  LAYER1: `0 1px 2px 0 ${defaultColor.TRANSPARENCY_30}`,
  LAYER2: `0 2px 4px 1px ${defaultColor.TRANSPARENCY_30}`,
  LAYER3: `0 4px 8px 2px ${defaultColor.TRANSPARENCY_30}`,
  LAYER4: `0 8px 16px 4px ${defaultColor.TRANSPARENCY_30}`,
  OUTLINE: defaultOutline,
  OUTLINE_MARGIN: defaultOutlineMargin,
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
