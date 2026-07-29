export {
  CHART_COLORS,
  SINGLE_CHART_COLORS,
  OTHER_CHART_COLOR,
  FONT_FAMILY,
  defaultColor as SMARTHR_DEFAULT_COLORS,
} from 'smarthr-ui'

export const BORDER_DASHES = [
  [],
  [10, 10],
  [20, 5],
  [15, 3, 3, 3],
  [2, 2],
] as const satisfies number[][]

export const POINT_STYLES = ['circle', 'rect', 'rectRounded', 'rectRot', 'triangle'] as const

export const PATTERN_SIZE = 10

export const SHAPE_TYPES = [
  'diamond',
  'zigzag',
  'disc',
  'zigzag-vertical',
  'plus',
  'square',
  'ring',
  'diagonal',
  'triangle',
  'dot',
  'diagonal-right-left',
  'box',
  'triangle-inverted',
] as const

/**
 * ドーナツチャートのセグメント同士の間隔（px）。
 * 白のボーダーで隙間を表現すると背景が白でない場所で線が浮くため、
 * 背景色に依存しない spacing で実際に隙間を空ける。
 */
export const DOUGHNUT_SEGMENT_SPACING = 8

export const CUTOUT_BY_THICKNESS = {
  S: '85%',
  M: '75%',
  L: '60%',
} as const satisfies Record<'S' | 'M' | 'L', string>
