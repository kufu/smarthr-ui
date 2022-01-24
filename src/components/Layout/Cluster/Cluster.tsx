import styled, { css } from 'styled-components'
import { useSpacing } from '../../../hooks/useSpacing'
import type { Gap, SeparateGap } from '../type'

type alignMethod = 'normal' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'
type justifyMethod = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around'

export const Cluster = styled.div<{
  /** 間隔の指定（基準フォントサイズの相対値または抽象値） */
  gap?: Gap | SeparateGap
  /** 垂直方向の揃え方（align-items） */
  align?: alignMethod
  /** 水平方向の揃え方（justify-content） */
  justify?: justifyMethod
}>(({ gap = 0.5, align, justify }) => {
  const rowGap = gap instanceof Object ? useSpacing(gap.row) : useSpacing(gap)
  const columnGap = gap instanceof Object ? useSpacing(gap.column) : useSpacing(gap)

  return css`
    display: flex;
    flex-wrap: wrap;
    ${align && `align-items: ${align};`}
    ${justify && `justify-content: ${justify};`}
    row-gap: ${rowGap};
    column-gap: ${columnGap};
  `
})
