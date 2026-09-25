import { type ComponentProps, type FC, type PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

type BaseProps = PropsWithChildren<{
  /** 罫線の種類 */
  borderType?: 'vertical' | 'horizontal' | 'both' | 'outer' | 'all'
  /** 罫線のスタイル */
  borderStyle?: 'solid' | 'dotted' | 'dashed'
  /** 角丸を適用する範囲 */
  rounded?: boolean | 'all' | 'top' | 'right' | 'bottom' | 'left'
  /** テーブルのレイアウト */
  layout?: 'auto' | 'fixed'
  /** ヘッダーを固定するかどうか */
  fixedHead?: boolean
}>
type Props = BaseProps & Omit<ComponentProps<'table'>, keyof BaseProps>

const ROUNDED = {
  t_l: '[&>thead:first-child>tr:first-child>th:first-child]:shr-rounded-tl-l [&>thead:first-child>tr:first-child>td:first-child]:shr-rounded-tl-l',
  t_r: '[&>thead:first-child>tr:first-child>th:last-child]:shr-rounded-tr-l [&>thead:first-child>tr:first-child>td:last-child]:shr-rounded-tr-l',
  b_l: '[&>tbody:last-child>tr:last-child>th:first-child]:shr-rounded-bl-l [&>tbody:last-child>tr:last-child>td:first-child]:shr-rounded-bl-l',
  b_r: '[&>tbody:last-child>tr:last-child>th:last-child]:shr-rounded-br-l [&>tbody:last-child>tr:last-child>td:last-child]:shr-rounded-br-l',
}
const ROUNDED_ALL = [ROUNDED.t_l, ROUNDED.t_r, ROUNDED.b_l, ROUNDED.b_r]

const classNameGenerator = tv({
  base: [
    'smarthr-ui-Table',
    'shr-w-full shr-border-collapse',
    '[&_tbody]:shr-bg-white',
    '[&_th]:contrast-more:shr-border-shorthand [&_th]:shr-bg-head [&_th]:contrast-more:shr-border-high-contrast',
    '[&_td]:contrast-more:shr-border-shorthand [&_td]:contrast-more:shr-border-high-contrast',
    'contrast-more:shr-border-shorthand contrast-more:shr-border-high-contrast',
  ],
  variants: {
    borderType: {
      vertical: {},
      horizontal: {},
      both: {},
      outer: 'shr-border-shorthand',
      all: 'shr-border-shorthand',
    } satisfies Record<NonNullable<BaseProps['borderType']>, string | Record<string, never>>,
    borderStyle: {
      solid: '[&_:is(.smarthr-ui-Th,.smarthr-ui-Td)]:shr-border-solid',
      dotted: '[&_:is(.smarthr-ui-Th,.smarthr-ui-Td)]:shr-border-dotted',
      dashed: '[&_:is(.smarthr-ui-Th,.smarthr-ui-Td)]:shr-border-dashed',
    } satisfies Record<NonNullable<BaseProps['borderStyle']>, string>,
    rounded: {
      true: ROUNDED_ALL,
      all: ROUNDED_ALL,
      top: [ROUNDED.t_l, ROUNDED.t_r],
      right: [ROUNDED.t_r, ROUNDED.b_r],
      bottom: [ROUNDED.b_l, ROUNDED.b_r],
      left: [ROUNDED.t_l, ROUNDED.b_l],
    } satisfies Record<Exclude<NonNullable<BaseProps['rounded']>, boolean> | 'true', string[]>,
    layout: {
      auto: '',
      fixed: 'shr-table-fixed',
    } satisfies Record<NonNullable<BaseProps['layout']>, string>,
    fixedHead: {
      true: '[&_tbody]:shr-relative [&_tbody]:shr-z-1 [&_thead]:shr-sticky [&_thead]:shr-start-0 [&_thead]:shr-top-0 [&_thead]:shr-z-[2]',
    } satisfies Record<'true', string>,
  },
  compoundVariants: [
    {
      borderType: ['vertical', 'both', 'all'],
      className: [
        '[&_:is(.smarthr-ui-Th:not(:first-child),.smarthr-ui-Td:not(:first-child))]:shr-border-l',
        '[&_:is(.smarthr-ui-Th:not(:first-child),.smarthr-ui-Td:not(:first-child))]:shr-border-l-default',
      ],
    },
    {
      borderType: ['horizontal', 'both', 'all'],
      className: [
        // thead がある場合は、thead 配下以外の th と td に border-t を適用
        '[&:has(thead)_tr:not(:where(thead_tr))_:is(.smarthr-ui-Th,.smarthr-ui-Td)]:shr-border-t',
        '[&:has(thead)_tr:not(:where(thead_tr))_:is(.smarthr-ui-Th,.smarthr-ui-Td)]:shr-border-t-default',
        // thead がない場合は、最初以外の tr 配下の th と td に border-t を適用
        '[&:not(:has(thead))_tr:not(:first-of-type)_:is(.smarthr-ui-Th,.smarthr-ui-Td)]:shr-border-t',
        '[&:not(:has(thead))_tr:not(:first-of-type)_:is(.smarthr-ui-Th,.smarthr-ui-Td)]:shr-border-t-default',
      ],
    },
  ],
  defaultVariants: {
    borderType: 'horizontal',
    borderStyle: 'solid',
    layout: 'auto',
    fixedHead: false,
  },
})

export const ActualTable: FC<Props> = ({
  borderType,
  borderStyle,
  fixedHead,
  layout,
  rounded,
  className,
  children,
  ...rest
}) => {
  const actualClassName = useMemo(
    () =>
      classNameGenerator({
        borderType,
        borderStyle,
        fixedHead,
        layout,
        rounded,
        className,
      }),
    [borderType, borderStyle, className, fixedHead, layout, rounded],
  )

  return (
    <table {...rest} className={actualClassName}>
      {children}
    </table>
  )
}
