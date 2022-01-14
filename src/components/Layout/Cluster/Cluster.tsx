import React from 'react'
import styled, { css } from 'styled-components'
import { useSpacing } from '../../../hooks/useSpacing'
import type { Gap, SeparateGap } from '../type'

type alignMethod = 'normal' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'
type justifyMethod = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around'

/**
 * @param gap 間隔の指定（基準フォントサイズの相対値または抽象値）
 * @param rowGap 垂直方向の間隔の指定（基準フォントサイズの相対値または抽象値）
 * @param columnGap 水平方向の間隔の指定（基準フォントサイズの相対値または抽象値）
 * @param align 垂直方向の揃え方（align-items）
 * @param justify 水平方向の揃え方（justify-content）
 * @param as ネガティブマージンを隠す要素の HTML タグ名
 * @param bodyAs Cluster 本体の HTML タグ名
 * @param children 均等に間隔を空けたい要素群
 */
export const Cluster: React.VFC<{
  /** 間隔の指定（基準フォントサイズの相対値または抽象値） */
  gap?: Gap | SeparateGap
  /** 垂直方向の揃え方（align-items） */
  align?: alignMethod
  /** 水平方向の揃え方（justify-content） */
  justify?: justifyMethod
  /** ネガティブマージンを隠す要素の HTML タグ名 */
  as?: React.ElementType
  /** Cluster 本体の HTML タグ名 */
  bodyAs?: React.ElementType
  /** 均等に間隔を空けたい要素群 */
  children?: React.ReactNode
}> = ({ gap = 0.5, align, justify, as, bodyAs, children }) => (
  <Wrapper as={as}>
    <Body as={bodyAs} gap={gap} align={align} justify={justify}>
      {children}
    </Body>
  </Wrapper>
)

// gap のネガティブマージンを隠すための要素、gap が利用できる場合は不要
// Wrapper to hide the negative margin of gap, not required if gap is available.
const Wrapper = styled.div`
  display: block; /* expect it to always be "block" */
  overflow: hidden;

  @supports (gap: 1px) {
    overflow: revert;
  }
`
const Body = styled.div<{
  gap: Gap | SeparateGap
  align?: alignMethod
  justify?: justifyMethod
}>(({ gap, align, justify }) => {
  const rowGap = gap instanceof Object ? useSpacing(gap.row) : useSpacing(gap)
  const columnGap = gap instanceof Object ? useSpacing(gap.column) : useSpacing(gap)

  return css`
    display: flex;
    flex-wrap: wrap;
    ${align && `align-items: ${align};`}
    ${justify && `justify-content: ${justify};`}
    margin: calc(${rowGap} / 2 * -1) calc(${columnGap} / 2 * -1);

    > * {
      margin: calc(${rowGap} / 2) calc(${columnGap} / 2);
    }

    @supports (gap: 1px) {
      margin: revert;
      row-gap: ${rowGap};
      column-gap: ${columnGap};

      > * {
        margin: revert;
      }
    }
  `
})
