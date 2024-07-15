import { merge } from '../libs/lodash'

export type BreakpointProperty = {
  SP?: number
  TABLET?: number
  NARROW?: string
}

export type CreatedBreakpointTheme = {
  SP: number
  TABLET: number
  NARROW?: string
}

export const defaultBreakpoint = { SP: 599, TABLET: 959, NARROW: '750px' }

export const createBreakpoint = (userBreakpoint: BreakpointProperty = {}) => {
  const created: CreatedBreakpointTheme = merge({ ...defaultBreakpoint }, userBreakpoint)
  return created
}
