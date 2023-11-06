import styled, { css } from 'styled-components'

import { useSpacing } from '../../../hooks/useSpacing'

import type { Gap } from '../../../types'

export const Center = styled.div<{
  /** コンテンツの最小高さ */
  minHeight?: number | string
  /** コンテンツの最大幅 */
  maxWidth?: number | string
  /** 境界とコンテンツの間の余白 */
  padding?: Gap
  /** 天地中央揃えも有効化するかどうか */
  verticalCentering?: boolean
}>(
  ({ minHeight, maxWidth, padding, verticalCentering = false }) => css`
    box-sizing: content-box;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: column;
    align-items: center;

    ${minHeight && `min-height: ${minHeight};`}
    ${maxWidth && `max-width: ${maxWidth};`}
    ${padding && `padding: ${useSpacing(padding)};`}
    ${verticalCentering && 'justify-content: center;'}
  `,
)
