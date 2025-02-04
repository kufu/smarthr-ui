export type BreakpointProperty = {
  SP?: number
  TABLET?: number
}

export type CreatedBreakpointTheme = Required<BreakpointProperty>

export const defaultBreakpoint = { SP: 599, TABLET: 959 }

export const createBreakpoint = (userBreakpoint: BreakpointProperty = {}) =>
  ({ ...defaultBreakpoint, ...userBreakpoint }) as CreatedBreakpointTheme
