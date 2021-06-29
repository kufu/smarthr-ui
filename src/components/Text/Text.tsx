import React, { HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { useTheme } from '../../hooks/useTheme'
import { FontSizes } from '../../themes/createFontSize'
import { TextColors } from '../../themes/createColor'
import { Leadings } from '../../themes/createLeading'

export type TextProps = {
  size?: FontSizes
  weight?: 'normal' | 'bold'
  italic?: boolean
  color?: TextColors | 'inherit'
  leading?: Leadings
  emphasis?: boolean
}
type ElementProps = Omit<HTMLAttributes<HTMLElement>, keyof TextProps>

/**
 * @param [size] フォントサイズの抽象値（font-size）
 * @param [weight] フォントウェイト（font-weight）
 * @param [italic] 斜体にするかどうかの真偽値（font-style: italic）
 * @param [color] 色。初期値は inherit（color、）
 * @param [leading] 行送りの抽象値（line-height）
 * @param [emphasis] 強調するかどうかの真偽値。指定すると em 要素になる
 * @param [as] テキストコンポーネントの HTML タグ名。初期値は span
 * @param [children]
 */
export const Text: React.VFC<
  TextProps &
    ElementProps & {
      as?: 'address' | 'b' | 'em' | 'i' | 'mark' | 'p' | 'q' | 'small' | 'span' | 'strong' | 'time'
      children: React.ReactNode
    }
> = ({ as = 'span', ...props }) => {
  return <Wrapper as={props.emphasis ? 'em' : as} {...props} />
}

const Wrapper = styled.span<TextProps>(
  ({ size = 'M', weight = 'normal', italic, color = 'inherit', leading = 'NORMAL', emphasis }) => {
    const { color: shrColor, fontSize, leading: shrLeading } = useTheme()
    return css`
      font-size: ${fontSize[size]};
      line-height: ${shrLeading[leading]};
      font-weight: ${emphasis ? 'bold' : weight};
      ${italic && `font-style: italic;`}
      color: ${color === 'inherit' ? color : shrColor[color]};
    `
  },
)
