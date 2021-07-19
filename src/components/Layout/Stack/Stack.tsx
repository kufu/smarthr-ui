import { CSSProperties } from 'react'
import styled, { css } from 'styled-components'
import { AbstractSize, CharRelativeSize } from '../../../themes/createSpacing'
import { useSpacing } from '../../../hooks/useSpacing'

/**
 * @param inline true の場合は inline-flex
 * @param gap 間隔の指定（基準フォントサイズの相対値または抽象値）
 * @param align 並べ方の指定（align-items）
 * @param recursive 直下の要素だけでなく再帰的に適用するかどうかの指定
 * @param splitAfter 分割する位置の指定（nth-child に渡す値）
 */
export const Stack = styled.div<{
  inline?: boolean
  gap?: CharRelativeSize | AbstractSize
  align?: CSSProperties['alignItems']
  recursive?: boolean
  splitAfter?: number | string
}>(
  ({ inline = false, gap = 1, align, recursive = false, splitAfter }) =>
    css`
      display: ${inline ? 'inline-flex' : 'flex'};
      flex-direction: column;
      ${align && `align-items: ${align};`}
      justify-content: flex-start;

      /* For greater specificity than element type selectors */
      &&& {
        ${!recursive && '>'} * {
          margin-top: 0;
          margin-bottom: 0;
        }

        ${!recursive && '>'} * + * {
          margin-top: ${useSpacing(gap)};
        }

        ${splitAfter &&
        css`
          ${!recursive ? '> ' : '*'}:nth-child(${splitAfter}) {
            margin-bottom: auto;
          }
        `}
      }
    `,
)
