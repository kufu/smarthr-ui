import { type ComponentPropsWithoutRef, type PropsWithChildren, memo, useMemo } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { reelShadowClassNameGenerator } from './reelShadowStyle'

import type { CellContentWidth } from './type'

export type Props = PropsWithChildren<
  VariantProps<typeof classNameGenerator> & {
    /** 横スクロール時、カラムを左右いずれかに固定 */
    fixed?: 'left' | 'right'
    contentWidth?:
      | CellContentWidth
      | { base?: CellContentWidth; min?: CellContentWidth; max?: CellContentWidth }
  }
>
type ElementProps = Omit<ComponentPropsWithoutRef<'td'>, keyof Props>

export const Td = memo<Props & ElementProps>(
  ({ align, vAlign, nullable, fixed, contentWidth, className, style, ...props }) => {
    const actualClassName = useMemo(() => {
      const base = classNameGenerator({ align, vAlign, nullable, className })

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

    return <td {...props} data-fixed={fixed} className={actualClassName} style={actualStyle} />
  },
)

const classNameGenerator = tv({
  base: [
    'smarthr-ui-Td',
    'shr-border-0 shr-px-1 shr-py-0.5 shr-align-middle shr-text-base shr-leading-normal shr-text-black shr-h-[calc(1em_*_theme(lineHeight.normal))]',
    '[&.fixed]:shr-bg-white',
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
