import React, { ComponentProps, PropsWithChildren, useMemo } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

type StyleType =
  | 'screenTitle'
  | 'sectionTitle'
  | 'blockTitle'
  | 'subBlockTitle'
  | 'subSubBlockTitle'

export const STYLE_TYPE_MAP: { [key in StyleType]: VariantProps<typeof text> } = {
  screenTitle: {
    size: 'XL',
    leading: 'TIGHT',
    weight: 'normal',
  },
  sectionTitle: {
    size: 'L',
    leading: 'TIGHT',
    weight: 'normal',
  },
  blockTitle: {
    size: 'M',
    leading: 'TIGHT',
    weight: 'bold',
  },
  subBlockTitle: {
    size: 'M',
    leading: 'TIGHT',
    weight: 'bold',
    color: 'TEXT_GREY',
  },
  subSubBlockTitle: {
    size: 'S',
    leading: 'TIGHT',
    weight: 'bold',
    color: 'TEXT_GREY',
  },
}
const UNDEFINED_STYLE_VALUES = {
  size: undefined,
  leading: undefined,
  weight: undefined,
  color: undefined,
}

const text = tv({
  variants: {
    size: {
      XXS: 'shr-text-2xs',
      XS: 'shr-text-xs',
      S: 'shr-text-sm',
      M: 'shr-text-base',
      L: 'shr-text-lg',
      XL: 'shr-text-xl',
      XXL: 'shr-text-2xl',
    },
    weight: {
      normal: 'shr-font-normal',
      bold: 'shr-font-bold',
    },
    italic: {
      true: 'shr-italic',
    },
    color: {
      TEXT_BLACK: 'shr-text-black',
      TEXT_WHITE: 'shr-text-white',
      TEXT_GREY: 'shr-text-grey',
      TEXT_DISABLED: 'shr-text-disabled',
      TEXT_LINK: 'shr-text-link',
      inherit: 'shr-text-color-inherit',
    },
    leading: {
      NONE: 'shr-leading-none',
      TIGHT: 'shr-leading-tight',
      NORMAL: 'shr-leading-normal',
      LOOSE: 'shr-leading-loose',
    },
    whiteSpace: {
      normal: 'shr-whitespace-normal',
      nowrap: 'shr-whitespace-nowrap',
      pre: 'shr-whitespace-pre',
      'pre-line': 'shr-whitespace-pre-line',
      'pre-wrap': 'shr-whitespace-pre-wrap',
    },
  },
})

// VariantProps を使うとコメントが書けない〜🥹
export type TextProps<T extends React.ElementType = 'span'> = VariantProps<typeof text> & {
  /** テキストコンポーネントの HTML タグ名。初期値は span */
  as?: T
  /** 強調するかどうかの真偽値。指定すると em 要素になる */
  emphasis?: boolean
  /** 見た目の種類 */
  styleType?: StyleType
}

export const Text = <T extends React.ElementType = 'span'>({
  emphasis,
  styleType,
  weight = emphasis ? 'bold' : undefined,
  as: Component = emphasis ? 'em' : 'span',
  size,
  italic,
  color,
  leading,
  whiteSpace,
  className,
  ...props
}: PropsWithChildren<TextProps<T> & ComponentProps<T>>) => {
  const styles = useMemo(() => {
    const styleTypeValues = styleType
      ? STYLE_TYPE_MAP[styleType as StyleType]
      : UNDEFINED_STYLE_VALUES

    return text({
      size: size || styleTypeValues.size,
      weight: weight || styleTypeValues.weight,
      color: color || styleTypeValues.color,
      leading: leading || styleTypeValues.leading,
      italic,
      whiteSpace,
      className,
    })
  }, [size, weight, italic, color, leading, whiteSpace, className, styleType])

  return <Component {...props} className={styles} />
}
