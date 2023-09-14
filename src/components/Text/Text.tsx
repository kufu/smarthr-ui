import React, { PropsWithChildren } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

const text = tv({
  variants: {
    size: {
      XXS: 'text-2xs',
      XS: 'text-xs',
      S: 'text-sm',
      M: 'text-base',
      L: 'text-lg',
      XL: 'text-xl',
      XXL: 'text-2xl',
    },
    weight: {
      bold: 'font-bold',
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
      NONE: 'leading-none',
      TIGHT: 'leading-tight',
      NORMAL: 'leading-normal',
      LOOSE: 'leading-loose',
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
export type TextProps = VariantProps<typeof text> & {
  /** テキストコンポーネントの HTML タグ名。初期値は span */
  as?: string | React.ComponentType<any> | undefined
  /** 強調するかどうかの真偽値。指定すると em 要素になる */
  emphasis?: boolean
}

export const Text: React.FC<PropsWithChildren<TextProps>> = ({
  emphasis,
  weight = emphasis ? 'bold' : undefined,
  as: Component = emphasis ? 'em' : 'span',
  ...props
}) => <Component {...props} className={text({ ...props, weight })} />
