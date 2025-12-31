export { CHART_COLORS, FONT_FAMILY, defaultColor as SMARTHR_DEFAULT_COLORS } from 'smarthr-ui'

export const BORDER_DASHES = [
  [],
  [10, 10],
  [20, 5],
  [15, 3, 3, 3],
  [2, 2],
] as const satisfies number[][]

export const POINT_STYLES = ['circle', 'rect', 'rectRounded', 'rectRot', 'triangle'] as const

export const SHAPE_TYPES = [
  'diamond',
  'zigzag',
  'disc',
  'zigzag-vertical',
  'diamond-box',
  'plus',
  'square',
  'ring',
  'diagonal',
  'cross',
  'triangle',
  'dash',
  'dot',
  'diagonal-right-left',
  'box',
  'triangle-inverted',
] as const
