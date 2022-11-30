import styled, { css } from 'styled-components'

import { useSpacing } from '../../../hooks/useSpacing'
import { Gap } from '../type'

export const Center = styled.div<{
  /** コンテンツの最小高さ */
  minHeight?: number | string
  /** コンテンツの最大幅 */
  maxWidth?: number | string
  /** 境界とコンテンツの間の余白 */
  padding?: Gap
  /** true の場合は垂直中央揃えを有効化 */
  vAlign?: boolean
}>(({ minHeight, maxWidth, padding, vAlign = false }) => {
  return css`
    box-sizing: content-box;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: column;
    align-items: center;

    ${minHeight && `min-height: ${minHeight};`}
    ${maxWidth && `max-width: ${maxWidth};`}
    ${padding && `padding: ${useSpacing(padding)};`}
    ${vAlign && 'justify-content: center;'}
  `
})
