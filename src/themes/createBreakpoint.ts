import { merge } from '../libs/lodash'

export type BreakpointProperty = {
  SP?: number
  TABLET?: number
}

export type CreatedBreakpointTheme = {
  SP: number
  TABLET: number
}

export const defaultBreakpoint = { SP: 599, TABLET: 959 }

export const createBreakpoint = (userBreakpoint: BreakpointProperty = {}) => {
  const created: CreatedBreakpointTheme = merge({ ...defaultBreakpoint }, userBreakpoint)
  return created
}
