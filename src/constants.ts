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
