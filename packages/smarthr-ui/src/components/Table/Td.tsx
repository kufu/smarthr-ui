import { type ComponentPropsWithoutRef, type PropsWithChildren, memo, useMemo } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { reelShadowClassNameGenerator } from './useReelShadow'

import type { CellContentWidth } from './type'

export type Props = PropsWithChildren<
  VariantProps<typeof classNameGenerator> & {
    contentWidth?:
      | CellContentWidth
      | { base?: CellContentWidth; min?: CellContentWidth; max?: CellContentWidth }
  }
>
type ElementProps = Omit<ComponentPropsWithoutRef<'td'>, keyof Props>

export const Td = memo<Props & ElementProps>(
  ({ align, vAlign, nullable, fixed, contentWidth, className, style, ...props }) => {
    const actualClassName = useMemo(() => {
      const base = classNameGenerator({ align, vAlign, nullable, fixed, className })

      if (!fixed) {
        return base
      }

      const shadow = reelShadowClassNameGenerator({ direction: fixed })

      return `${base} ${shadow}`
    }, [align, className, fixed, nullable, vAlign])
    const actualStyle = useMemo(() => {
      if (typeof contentWidth === 'object') {
        return {
          ...style,
          width: convertContentWidth(contentWidth.base),
          minWidth: convertContentWidth(contentWidth.min),
          maxWidth: convertContentWidth(contentWidth.max),
        }
      }

      return {
        ...style,
        width: convertContentWidth(contentWidth),
      }
    }, [style, contentWidth])

    return <td {...props} className={actualClassName} style={actualStyle} />
  },
)

const classNameGenerator = tv({
  base: [
    'smarthr-ui-Td',
    'shr-border-solid shr-border-0 shr-px-1 shr-py-0.5 shr-align-middle shr-text-base shr-leading-normal shr-text-black shr-h-[calc(1em_*_theme(lineHeight.normal))]',
    [
      '[.shr-table-border-horizontal_&]:shr-border-t',
      '[.shr-table-border-horizontal_&]:shr-border-t-default',
    ],
    [
      '[.shr-table-border-vertical_&+&]:shr-border-l',
      '[.shr-table-border-vertical_&+&]:shr-border-l-default',
    ],
  ],
  variants: {
    align: {
      left: '',
      right: 'shr-text-right',
    },
    vAlign: {
      middle: '',
      baseline: 'shr-align-baseline',
    },
    nullable: {
      true: "empty:after:shr-content-['-----']",
    },
    fixed: {
      left: [
        /* これ以降の記述はTableReel内で'fixed'を利用した際に追従させるために必要 */
        '[&.fixed]:shr-sticky [&.fixed]:after:shr-opacity-100 [&.fixed]:shr-bg-white',
        'fixedLeft [&.fixed]:shr-left-0',
      ],
      right: [
        /* これ以降の記述はTableReel内で'fixed'を利用した際に追従させるために必要 */
        '[&.fixed]:shr-sticky [&.fixed]:after:shr-opacity-100 [&.fixed]:shr-bg-white',
        'fixedRight [&.fixed]:shr-right-0',
      ],
    },
  },
  defaultVariants: {
    align: 'left',
    vAlign: 'middle',
    nullable: false,
  },
})

const convertContentWidth = (contentWidth?: CellContentWidth) => {
  if (typeof contentWidth === 'number') {
    return `${contentWidth}em`
  }

  return contentWidth
}
