import { type FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import type { ExtendElementPropsWithRef } from '../../types'

type Props = ExtendElementPropsWithRef<
  'table',
  {
    /** 罫線の種類 */
    borderType?: 'vertical' | 'horizontal' | 'both' | 'outer' | 'all'
    /** 罫線のスタイル */
    borderStyle?: 'solid' | 'dotted' | 'dashed'
    /** テーブルのレイアウト */
    layout?: 'auto' | 'fixed'
    /** ヘッダーを固定するかどうか */
    fixedHead?: boolean
  }
>

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
    } satisfies Record<NonNullable<Props['borderType']>, string | Record<string, never>>,
    borderStyle: {
      solid: '[&_:is(.smarthr-ui-Th,.smarthr-ui-Td)]:shr-border-solid',
      dotted: '[&_:is(.smarthr-ui-Th,.smarthr-ui-Td)]:shr-border-dotted',
      dashed: '[&_:is(.smarthr-ui-Th,.smarthr-ui-Td)]:shr-border-dashed',
    } satisfies Record<NonNullable<Props['borderStyle']>, string>,
    layout: {
      auto: '',
      fixed: 'shr-table-fixed',
    } satisfies Record<NonNullable<Props['layout']>, string>,
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
        className,
      }),
    [borderType, borderStyle, className, fixedHead, layout],
  )

  return (
    <table {...rest} className={actualClassName}>
      {children}
    </table>
  )
}
