import styled, { css } from 'styled-components'

import { useSpacing } from '../../../hooks/useSpacing'
import { AbstractSize, CharRelativeSize } from '../../../themes/createSpacing'

type alignMethod = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around'
type verticalAlignMethod = 'normal' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'

/**
 * @deprecated LineUp コンポーネントは非推奨です。Cluster または Sidebar コンポーネントを使用してください。
 * @param inline true の場合は inline-flex
 * @param gap 間隔の指定（基準フォントサイズの相対値または抽象値）。align が space-between や space-around を取る場合は無視されます
 * @param reverse 並べる方向の指定（flex-direction）
 * @param align 並べ方の指定（justify-content）
 * @param vAlign 縦位置の揃え方（align-items）
 */
export const LineUp = styled.div<{
  /** true の場合は inline-flex */
  inline?: boolean
  /** 間隔の指定（基準フォントサイズの相対値または抽象値）。align が space-between や space-around を取る場合は無視されます */
  gap?: CharRelativeSize | AbstractSize
  /** 並べる方向の指定（flex-direction） */
  reverse?: boolean
  /** 並べ方の指定（justify-content） */
  align?: alignMethod
  /** 縦位置の揃え方（align-items） */
  vAlign?: verticalAlignMethod
}>(({ inline = false, gap = 0.5, reverse, align = 'flex-start', vAlign = 'normal' }) => css`
    display: ${inline ? 'inline-flex' : 'flex'};
    ${reverse && 'flex-direction: row-reverse;'}
    ${align && `justify-content: ${align};`}
    ${vAlign && `align-items: ${vAlign};`}
    gap: ${useSpacing(gap)};

    /* 
      Chromeで空の要素にflex-gapがあると印刷時にレイアウトが崩れるので gap の値を0にする
      See https://bugs.chromium.org/p/chromium/issues/detail?id=1161709
    */
    &:empty {
      gap: 0;
    }
  `)
