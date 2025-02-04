export type RadiusProperty = {
  s?: string
  m?: string
  l?: string
  full?: string
}

export type CreatedRadiusTheme = Required<RadiusProperty>

export const defaultRadius: CreatedRadiusTheme = {
  s: '4px',
  m: '6px',
  l: '8px',
  full: '10000px',
}

export const createRadius = (userRadius: RadiusProperty = {}) =>
  ({ ...defaultRadius, ...userRadius }) as CreatedRadiusTheme
