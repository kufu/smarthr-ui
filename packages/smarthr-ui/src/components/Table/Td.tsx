import React, { ComponentPropsWithoutRef, FC, PropsWithChildren, useMemo } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { reelShadowStyle } from './useReelShadow'

import type { CellContentWidth } from './type'

export type Props = PropsWithChildren<
  VariantProps<typeof td> & {
    contentWidth?:
      | CellContentWidth
      | { base?: CellContentWidth; min?: CellContentWidth; max?: CellContentWidth }
  }
>
type ElementProps = Omit<ComponentPropsWithoutRef<'td'>, keyof Props>

export const Td: FC<Props & ElementProps> = ({
  align = 'left',
  nullable = false,
  fixed = false,
  contentWidth,
  className,
  style,
  ...props
}) => {
  const styleProps = useMemo(() => {
    const tdStyles = td({ align, nullable, fixed, className })
    const reelShadowStyles = fixed ? reelShadowStyle({ direction: 'right' }) : ''
    return {
      className: `${tdStyles} ${reelShadowStyles}`.trim(),
      style: {
        ...style,
        ...getWidthStyle(contentWidth),
      },
    }
  }, [align, className, contentWidth, fixed, nullable, style])

  return <td {...props} {...styleProps} />
}

const td = tv({
  base: [
    'smarthr-ui-Td',
    'shr-border-t-shorthand shr-h-[calc(1em_*_theme(lineHeight.normal))] shr-px-1 shr-py-0.5 shr-align-middle shr-text-base shr-leading-normal shr-text-black',
  ],
  variants: {
    align: {
      left: '',
      right: 'shr-text-right',
    },
    nullable: {
      true: "empty:after:shr-content-['-----']",
    },
    fixed: {
      true: [
        'fixedElement',
        'shr-sticky shr-bg-white [&.fixed]:after:shr-opacity-100',
        '[&:first-child]:shr-left-0',
        '[&.fixed:first-child]:after:shr-left-full [&.fixed:first-child]:after:shr-bg-gradient-to-r',
        '[&:last-child]:shr-right-0',
        'after:shr-right-full after:shr-bg-gradient-to-l',
      ],
    },
  },
})

const convertContentWidth = (contentWidth?: CellContentWidth) => {
  if (typeof contentWidth === 'number') {
    return `${contentWidth}em`
  }

  return contentWidth
}

const getWidthStyle = (contentWidth: Props['contentWidth']) => {
  if (typeof contentWidth === 'object') {
    return {
      width: convertContentWidth(contentWidth.base),
      minWidth: convertContentWidth(contentWidth.min),
      maxWidth: convertContentWidth(contentWidth.max),
    }
  }

  return {
    width: convertContentWidth(contentWidth),
  }
}
