import { css } from 'styled-components'

export const VISUALLY_HIDDEN_STYLE = css`
  position: absolute;
  top: -1px;
  left: 0;
  width: 1px;
  height: 1px;
  border: 0;
  padding: 0;
  white-space: nowrap;
  clip-path: inset(100%);
  clip: rect(0 0 0 0);
  overflow: hidden;
`
export const FONT_FAMILY = 'system-ui, sans-serif'
export const CHART_COLORS = [
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
export const OTHER_CHART_COLOR = 'rgb(235, 235, 235)'
