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

export const createBreakpoint = (userBreakpoint: BreakpointProperty = {}): CreatedBreakpointTheme =>
  merge({ ...defaultBreakpoint }, userBreakpoint)
