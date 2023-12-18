import React, { ComponentProps, PropsWithChildren, useMemo } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

import { HeadingTypes, MAPPER_SIZE_AND_WEIGHT } from '../Heading/Heading'

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
      inherit: 'shr-text-inherit',
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
export type TextProps = VariantProps<typeof text> & {
  /** テキストコンポーネントの HTML タグ名。初期値は span */
  as?: string | React.ComponentType<any> | undefined
  /** 強調するかどうかの真偽値。指定すると em 要素になる */
  emphasis?: boolean
  /** 見た目の種類。Heading の種類と同じ */
  styleType?: HeadingTypes
}

export const Text: React.FC<PropsWithChildren<TextProps & ComponentProps<'span'>>> = ({
  emphasis,
  styleType,
  weight = emphasis ? 'bold' : undefined,
  as: Component = emphasis ? 'em' : 'span',
  ...props
}) => {
  const { size, italic, color, leading, whiteSpace, className, ...others } = props
  const styleTypeValues = styleType ? MAPPER_SIZE_AND_WEIGHT[styleType] : null

  const styles = useMemo(
    () =>
      text({
        size: size || styleTypeValues?.size,
        weight: weight || styleTypeValues?.weight,
        color: color || styleTypeValues?.color,
        italic,
        leading,
        whiteSpace,
        className,
      }),
    [size, weight, italic, color, leading, whiteSpace, className, styleTypeValues],
  )

  return <Component {...others} className={styles} />
}
