import { merge } from '../libs/lodash'

// Allow deviations from the JavaScript naming convention to match SmartHR design guidelines
export interface FontProperty {
  BASIC?: string
}

export interface CreatedFontTheme {
  BASIC: string
}

export const defaultFont = {
  BASIC:
    'system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "ヒラギノ角ゴ ProN W3", Meiryo, "メイリオ", sans-serif',
}

export const createFont = (userFont: FontProperty = {}) => {
  const created: CreatedFontTheme = merge(defaultFont, userFont)
  return created
}
