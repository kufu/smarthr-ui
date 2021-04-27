import styled, { css } from 'styled-components'
import { AbstractSize, CharRelativeSize } from '../../../themes/createSpacing'
import { useSpacing } from '../../../hooks/useSpacing'

/**
 * @param gap 間隔の指定（rem の値）
 * @param recursive 直下の要素だけでなく再帰的に適用するかどうかの指定
 * @param splitAfter 分割する位置の指定（nth-child に渡す値）
 */
export const Stack = styled.div<{
  gap?: CharRelativeSize | AbstractSize
  recursive?: boolean
  splitAfter?: number | string
}>(
  ({ gap = 1, recursive = false, splitAfter }) =>
    css`
      display: flex;
      flex-direction: column;
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
        `
          ${!recursive && '>'} :nth-child(${splitAfter}) {
            margin-bottom: auto;
          }
        `}
      }
    `,
)
