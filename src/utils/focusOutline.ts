import { css } from 'styled-components'
import { Theme } from '../hooks/useTheme'

export function focusOutline(theme: Theme) {
  return css`
    outline: none;
    isolation: isolate;
    box-shadow: ${theme.shadow.OUTLINE};
  `
}
