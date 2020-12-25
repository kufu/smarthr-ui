import { merge } from '../libs/lodash'

export interface BreakPointProperty {
  SP?: number
  TABLET?: number
}

export interface CreatedBreakPointTheme {
  SP: number
  TABLET: number
}

export const defaultBreakPoint = { SP: 599, TABLET: 959 }

export const createBreakPoint = (userBreakPoint: BreakPointProperty = {}) => {
  const created: CreatedBreakPointTheme = merge(defaultBreakPoint, userBreakPoint)
  return created
}
