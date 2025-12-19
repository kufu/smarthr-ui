'use client'

import { type ComponentProps, type FC, type PropsWithChildren, useMemo } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { useDevice } from '../../../hooks/useDevice'
import { paddingBlock, paddingInline } from '../../../themes/tailwind'

import type { Gap } from '../../../types'

type AbstractProps = PropsWithChildren<
  Omit<VariantProps<typeof classNameGenerator>, 'paddingBlock' | 'paddingInline'> & {
    padding?: Gap | SeparatePadding
  }
>
type Props = AbstractProps & Omit<ComponentProps<'div'>, keyof AbstractProps>

type SeparatePadding = {
  block?: Gap
  inline?: Gap
  /** 画面幅が狭い時のブロック方向パディング */
  narrowModeBlock?: Gap
  /** 画面幅が狭い時のインライン方向パディング */
  narrowModeInline?: Gap
}

export const classNameGenerator = tv({
  base: 'shr-mx-auto shr-w-full',
  variants: {
    size: {
      NARROW: 'shr-max-w-col6',
      DEFAULT: 'shr-max-w-col8',
      WIDE: 'shr-max-w-col9',
      FULL: '',
    },
    paddingBlock,
    paddingInline,
  },
  compoundVariants: [
    {
      paddingInline: [0.25, 'X3S'],
      className: 'shr-w-[calc(100%-theme(spacing[0.25])*2)]',
    },
    {
      paddingInline: [0.5, 'XXS'],
      className: 'shr-w-[calc(100%-theme(spacing[0.5])*2)]',
    },
    {
      paddingInline: 0.75,
      className: 'shr-w-[calc(100%-theme(spacing[0.75])*2)]',
    },
    {
      paddingInline: [1, 'XS'],
      className: 'shr-w-[calc(100%-theme(spacing[1])*2)]',
    },
    {
      paddingInline: 1.25,
      className: 'shr-w-[calc(100%-theme(spacing[1.25])*2)]',
    },
    {
      paddingInline: [1.5, 'S'],
      className: 'shr-w-[calc(100%-theme(spacing[1.5])*2)]',
    },
    {
      paddingInline: [2, 'M'],
      className: 'shr-w-[calc(100%-theme(spacing[2])*2)]',
    },
    {
      paddingInline: [2.5, 'L'],
      className: 'shr-w-[calc(100%-theme(spacing[2.5])*2)]',
    },
    {
      paddingInline: [3, 'XL'],
      className: 'shr-w-[calc(100%-theme(spacing[3])*2)]',
    },
    {
      paddingInline: [3.5, 'XXL'],
      className: 'shr-w-[calc(100%-theme(spacing[3.5])*2)]',
    },
    {
      paddingInline: [4, 'X3L'],
      className: 'shr-w-[calc(100%-theme(spacing[4])*2)]',
    },
    {
      paddingInline: 8,
      className: 'shr-w-[calc(100%-theme(spacing[8])*2)]',
    },
  ],
})

export const Container: FC<Props> = ({
  size = 'DEFAULT',
  padding = { block: 2, inline: 2, narrowModeBlock: 1.5, narrowModeInline: 1 },
  className,
  ...rest
}) => {
  const { isNarrowView } = useDevice()
  const actualClassName = useMemo(() => {
    const actualPadding =
      padding instanceof Object
        ? padding
        : { block: padding, inline: padding, narrowModeBlock: padding, narrowModeInline: padding }
    return classNameGenerator({
      size,
      paddingBlock: isNarrowView ? actualPadding.narrowModeBlock : actualPadding.block,
      paddingInline: isNarrowView ? actualPadding.narrowModeInline : actualPadding.inline,
      className,
    })
  }, [size, className, padding, isNarrowView])
  return <div {...rest} className={actualClassName} />
}
