'use client'

import { type PropsWithChildren, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { STYLE_TYPE_MAP, Text, type TextProps } from '../../Text'
import { VisuallyHiddenText } from '../../VisuallyHiddenText'

import type { ElementProps } from '../Heading'

type StylingProps =
  | {
      /** テキストのスタイル */
      type: Extract<TextProps['styleType'], 'screenTitle'>

      /**
       * テキストのサイズ
       *
       * `screenTitle`の場合、`XXL`か`XL`を指定できます。
       *
       * @default 'XL'
       */
      size?: Extract<TextProps['size'], 'XXL' | 'XL'>
    }
  | {
      /** テキストのスタイル */
      type?: Extract<TextProps['styleType'], 'sectionTitle'>

      /**
       * テキストのサイズ
       *
       * `sectionTitle`の場合、`XXL`か`XL`か`L`を指定してください
       *
       * @default 'L'
       */
      size?: Extract<TextProps['size'], 'XXL' | 'XL' | 'L'>
    }
  | {
      /** テキストのスタイル */
      type: Exclude<TextProps['styleType'], 'screenTitle' | 'sectionTitle'>
      size?: never
    }

export type Props = PropsWithChildren<{
  /** 視覚的に非表示にするフラグ */
  visuallyHidden?: boolean
}> &
  StylingProps

const classNameGenerator = tv({
  base: 'smarthr-ui-Heading smarthr-ui-PageHeading',
  variants: {
    visuallyHidden: {
      false: 'shr-m-[unset]',
    },
  },
  defaultVariants: {
    visuallyHidden: false,
  },
})

export const PageHeading = memo<Props & ElementProps>(
  ({ type = 'screenTitle', size, className, visuallyHidden, ...props }) => {
    const actualClassName = useMemo(
      () => classNameGenerator({ visuallyHidden, className }),
      [className, visuallyHidden],
    )
    const actualTypography = useMemo(() => {
      const defaultTypography = STYLE_TYPE_MAP[type]
      if (size && (type === 'screenTitle' || type === 'sectionTitle')) {
        return { ...defaultTypography, size }
      }
      return defaultTypography
    }, [type, size])
    const Component = visuallyHidden ? VisuallyHiddenText : Text

    return (
      <Component
        {...props}
        {...actualTypography}
        role="heading"
        aria-level={1}
        as="h1"
        className={actualClassName}
      />
    )
  },
)
