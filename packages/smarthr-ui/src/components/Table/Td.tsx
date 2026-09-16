import { type ComponentPropsWithoutRef, type PropsWithChildren, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { reelShadowClassNameGenerator } from './reelShadowStyle'

import type { CellContentWidth } from './type'

export type BaseProps = PropsWithChildren<{
  /** テキストの水平方向の配置 */
  align?: 'left' | 'right'
  /** テキストの垂直方向の配置 */
  vAlign?: 'middle' | 'baseline'
  /** 値が空の場合にハイフンを表示するかどうか */
  nullable?: boolean
  /** 横スクロール時、カラムを左右いずれかに固定 */
  fixed?: 'left' | 'right'
  contentWidth?:
    CellContentWidth | { base?: CellContentWidth; min?: CellContentWidth; max?: CellContentWidth }
}>
type Props = BaseProps & Omit<ComponentPropsWithoutRef<'td'>, keyof BaseProps>

export const Td = memo<Props>(
  ({ align, vAlign, nullable, fixed, contentWidth, className, style, ...rest }) => {
    const actualClassName = useMemo(() => {
      const base = classNameGenerator({ align, vAlign, nullable, className })

      if (!fixed) {
        return base
      }

      const shadow = reelShadowClassNameGenerator({ direction: fixed })

      return `${base} ${shadow}`
    }, [align, className, fixed, nullable, vAlign])
    const actualStyle =
      typeof contentWidth === 'object'
        ? {
            ...style,
            width: convertContentWidth(contentWidth.base),
            minWidth: convertContentWidth(contentWidth.min),
            maxWidth: convertContentWidth(contentWidth.max),
          }
        : {
            ...style,
            width: convertContentWidth(contentWidth),
          }

    return <td {...rest} className={actualClassName} style={actualStyle} data-fixed={fixed} />
  },
)

const classNameGenerator = tv({
  base: [
    'smarthr-ui-Td',
    'shr-h-[calc(1em_*_theme(lineHeight.normal))] shr-border-0 shr-px-1 shr-py-0.5 shr-align-middle shr-text-base shr-leading-normal shr-text-black',
    '[&.fixed]:shr-bg-white',
  ],
  variants: {
    align: {
      left: '',
      right: 'shr-text-right',
    } satisfies Record<NonNullable<BaseProps['align']>, string>,
    vAlign: {
      middle: '',
      baseline: 'shr-align-baseline',
    } satisfies Record<NonNullable<BaseProps['vAlign']>, string>,
    nullable: {
      true: "empty:after:shr-content-['-----']",
    } satisfies Record<'true', string>,
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
