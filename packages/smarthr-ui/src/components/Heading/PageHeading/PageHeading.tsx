'use client'

import { type PropsWithChildren, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { STYLE_TYPE_MAP, Text, type TextProps } from '../../Text'
import { VisuallyHiddenText } from '../../VisuallyHiddenText'

import type { ElementProps } from '../Heading'

export type Props = PropsWithChildren<{
  /**
   * テキストのサイズ
   *
   * @default 'XL'
   */
  size?: Extract<TextProps['size'], 'XXL' | 'XL' | 'L'>

  /** 視覚的に非表示にするフラグ */
  visuallyHidden?: boolean
}>

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
  ({ size, className, visuallyHidden, ...props }) => {
    const actualClassName = useMemo(
      () => classNameGenerator({ visuallyHidden, className }),
      [className, visuallyHidden],
    )
    const actualTypography = useMemo(() => {
      const defaultTypography = STYLE_TYPE_MAP.screenTitle

      if (size) {
        return { ...defaultTypography, size }
      }

      return defaultTypography
    }, [size])
    const Component = visuallyHidden ? VisuallyHiddenText : Text

    return <Component {...props} {...actualTypography} as="h1" className={actualClassName} />
  },
)
