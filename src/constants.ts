import { shade, tint } from 'polished'

export const FONT_FAMILY = 'system-ui, sans-serif'
const BASE_CHART_COLORS = [
  'rgb(0, 196, 204)',
  'rgb(255, 205, 0)',
  'rgb(255, 145, 0)',
  'rgb(230, 85, 55)',
  'rgb(45, 75, 155)',
  'rgb(45, 125, 240)',
  'rgb(105, 215, 255)',
  'rgb(75, 180, 125)',
  'rgb(5, 135, 140)',
  'rgb(0, 90, 100)',
]
/* 機械的に使うことを考えて、基本チャート色が10色、基本色より明るい10色、暗い10色
 * lighten / darken よりも彩度は変わるが自然な色彩になるため tint / shade を使っている */
export const CHART_COLORS = [
  ...BASE_CHART_COLORS,
  ...BASE_CHART_COLORS.map((color) => tint(0.4, color)),
  ...BASE_CHART_COLORS.map((color) => shade(0.4, color)),
]
export const OTHER_CHART_COLOR = 'rgb(235, 235, 235)'
