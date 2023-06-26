import styled, { css } from 'styled-components'

import { useSpacing } from '../../../hooks/useSpacing'

import type { Gap, SeparateGap } from '../../../types'
import type { CSSProperties } from 'react'

export const Cluster = styled.div<{
  /** true の場合は inline-flex */
  inline?: boolean
  /** 間隔の指定（基準フォントサイズの相対値または抽象値） */
  gap?: Gap | SeparateGap
  /** 垂直方向の揃え方（align-items） */
  align?: CSSProperties['alignItems']
  /** 水平方向の揃え方（justify-content） */
  justify?: CSSProperties['justifyContent']
}>(({ gap = 0.5, align, justify, inline }) => {
  const rowGap = gap instanceof Object ? useSpacing(gap.row) : useSpacing(gap)
  const columnGap = gap instanceof Object ? useSpacing(gap.column) : useSpacing(gap)

  return css`
    display: ${inline ? 'inline-flex' : 'flex'};
    flex-wrap: wrap;
    ${align && `align-items: ${align};`}
    ${justify && `justify-content: ${justify};`}
    row-gap: ${rowGap};
    column-gap: ${columnGap};

    /* 
      Chromeで空の要素にflex-gapがあると印刷時にレイアウトが崩れるので gap の値を0にする
      See https://bugs.chromium.org/p/chromium/issues/detail?id=1161709
    */
    &:empty {
      gap: 0;
    }
  `
})
