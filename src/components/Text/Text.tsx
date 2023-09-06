import React, { CSSProperties, HTMLAttributes, PropsWithChildren } from 'react'
import styled, { css } from 'styled-components'
import { VariantProps, tv } from 'tailwind-variants'

import { useTheme } from '../../hooks/useTheme'
import { TextColors } from '../../themes/createColor'
import { FontSizes } from '../../themes/createFontSize'
import { Leadings } from '../../themes/createLeading'

export type TextProps = {
  size?: FontSizes
  weight?: CSSProperties['fontWeight']
  italic?: boolean
  color?: TextColors | 'inherit'
  leading?: Leadings
  whiteSpace?: CSSProperties['whiteSpace']
  emphasis?: boolean
}
type ElementProps = Omit<HTMLAttributes<HTMLElement>, keyof TextProps>

export type Props = TextProps &
  ElementProps & {
    as?: string | React.ComponentType<any> | undefined
    children: React.ReactNode
  }

/**
 * @param [size] フォントサイズの抽象値（font-size）
 * @param [weight] フォントウェイト（font-weight）
 * @param [italic] 斜体にするかどうかの真偽値（font-style: italic）
 * @param [color] 色。初期値は inherit（color、）
 * @param [leading] 行送りの抽象値（line-height）
 * @param [whiteSpace] ホワイトスペース（white-space）
 * @param [emphasis] 強調するかどうかの真偽値。指定すると em 要素になる
 * @param [as] テキストコンポーネントの HTML タグ名。初期値は span
 * @param [children]
 */
export const Text: React.FC<Props> = ({ color, as = 'span', ...props }) => (
  <Wrapper {...props} $color={color} as={props.emphasis ? 'em' : as} />
)

const text = tv({
  variants: {
    size: {
      '2xs': 'text-2xs',
      xs: 'text-xs',
      s: 'text-sm',
      m: 'text-base',
      l: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
    },
    bold: {
      true: 'font-bold',
    },
    italic: {
      true: 'italic',
    },
    color: {
      TEXT_BLACK: 'text-black',
      TEXT_WHITE: 'text-white',
      TEXT_GREY: 'text-grey',
      TEXT_DISABLED: 'text-disabled',
      TEXT_LINK: 'text-link',
      inherit: 'text-inherit',
    },
    leading: {
      none: 'leading-none',
      normal: 'leading-normal',
      tight: 'leading-tight',
      loose: 'leading-loose',
    },
    whiteSpace: {
      normal: 'whitespace-normal',
      nowrap: 'whitespace-nowrap',
      pre: 'whitespace-pre',
      'pre-line': 'whitespace-pre-line',
      'pre-wrap': 'whitespace-pre-wrap',
    },
  },
  defaultVariants: {},
})

// VariantProps を使うとコメントが書けない〜🥹
type NewTextVariants = VariantProps<typeof text>
type NewTextProps = PropsWithChildren<
  NewTextVariants & {
    /** テキストコンポーネントの HTML タグ名。初期値は span */
    as?: string | React.ComponentType<any> | undefined
    /** 強調するかどうかの真偽値。指定すると em 要素になる */
    emphasis?: boolean
  }
>

export const NewText: React.FC<NewTextProps> = ({
  bold,
  emphasis,
  as: Component = emphasis ? 'em' : 'span',
  ...props
}) => <Component {...props} className={text({ ...props, bold: emphasis || bold })} />

const Wrapper = styled.span<
  Omit<TextProps, 'color'> & {
    $color: TextProps['color']
  }
>(
  ({
    size = 'M',
    weight = 'normal',
    italic,
    $color = 'inherit',
    leading = 'NORMAL',
    whiteSpace,
    emphasis,
  }) => {
    const { color: shrColor, fontSize, leading: shrLeading } = useTheme()
    return css`
      ${whiteSpace && `white-space: ${whiteSpace};`}
      font-size: ${fontSize[size]};
      line-height: ${shrLeading[leading]};
      font-weight: ${emphasis ? 'bold' : weight};
      ${italic && `font-style: italic;`}
      color: ${$color === 'inherit' ? $color : shrColor[$color]};
    `
  },
)
