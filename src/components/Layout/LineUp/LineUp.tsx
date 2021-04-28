import styled, { css } from 'styled-components'
import { AbstractSize, CharRelativeSize } from '../../../themes/createSpacing'
import { useSpacing } from '../../../hooks/useSpacing'

type alignMethod = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around'
type verticalAlignMethod = 'normal' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'

/**
 * @param inline true の場合は inline-flex
 * @param gap 間隔の指定。align が space-between や space-around を取る場合は無視されます
 * @param reverse 並べる方向の指定（flex-direction）
 * @param align 並べ方の指定（justify-content）
 * @param vAlign 縦位置の揃え方（align-items）
 */
export const LineUp = styled.div<{
  inline?: boolean
  gap?: CharRelativeSize | AbstractSize
  reverse?: boolean
  align?: alignMethod
  vAlign?: verticalAlignMethod
}>(
  ({ inline = false, gap = 0.5, reverse, align = 'flex-start', vAlign = 'normal' }) => css`
    display: ${inline ? 'inline-flex' : 'flex'};
    ${reverse && 'flex-direction: row-reverse;'}
    ${align && `justify-content: ${align};`}
    ${vAlign && `align-items: ${vAlign};`}

    /* For greater specificity than element type selectors */
    &&& {
      ${(align === 'flex-start' || align === 'flex-end' || align === 'center') &&
      `
        > * + * {
          margin-left: ${useSpacing(gap)};
        }
      `}

      @supports (gap: 1px) {
        gap: ${useSpacing(gap)};

        > * + * {
          margin-left: revert;
        }
      }
    }
  `,
)
