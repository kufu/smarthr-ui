import { type ComponentProps, type FC, type PropsWithChildren, useMemo, useRef } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { TableReel } from './TableReel'
import { TableScrollContext } from './TableScrollContext'

type AbstractProps = PropsWithChildren<
  VariantProps<typeof classNameGenerator> & {
    reel?: boolean
  }
>
type Props = AbstractProps & Omit<ComponentProps<'table'>, keyof AbstractProps>

const ROUNDED = {
  t_l: '[&>thead:first-child>tr:first-child>th:first-child]:shr-rounded-tl-l [&>thead:first-child>tr:first-child>td:first-child]:shr-rounded-tl-l',
  t_r: '[&>thead:first-child>tr:first-child>th:last-child]:shr-rounded-tr-l [&>thead:first-child>tr:first-child>td:last-child]:shr-rounded-tr-l',
  b_l: '[&>tbody:last-child>tr:last-child>th:first-child]:shr-rounded-bl-l [&>tbody:last-child>tr:last-child>td:first-child]:shr-rounded-bl-l',
  b_r: '[&>tbody:last-child>tr:last-child>th:last-child]:shr-rounded-br-l [&>tbody:last-child>tr:last-child>td:last-child]:shr-rounded-br-l',
}
const ROUNDED_ALL = [ROUNDED.t_l, ROUNDED.t_r, ROUNDED.b_l, ROUNDED.b_r]

const classNameGenerator = tv({
  slots: {
    reelWrapper: ['smarthr-ui-TableReel', 'shr-relative'],
    inner: ['smarthr-ui-TableReel-inner', 'shr-relative'],
    table: [
      'smarthr-ui-Table',
      'shr-w-full shr-border-collapse',
      '[&_tbody]:shr-bg-white',
      '[&_th]:contrast-more:shr-border-shorthand [&_th]:shr-bg-head [&_th]:contrast-more:shr-border-high-contrast',
      '[&_td]:contrast-more:shr-border-shorthand [&_td]:contrast-more:shr-border-high-contrast',
      'contrast-more:shr-border-shorthand contrast-more:shr-border-high-contrast',
    ],
  },
  variants: {
    borderType: {
      vertical: {},
      horizontal: {},
      both: {},
      outer: {
        table: 'shr-border-shorthand',
      },
      all: {
        table: 'shr-border-shorthand',
      },
    },
    borderStyle: {
      solid: {
        table: '[&_:is(.smarthr-ui-Th,.smarthr-ui-Td)]:shr-border-solid',
      },
      dotted: {
        table: '[&_:is(.smarthr-ui-Th,.smarthr-ui-Td)]:shr-border-dotted',
      },
      dashed: {
        table: '[&_:is(.smarthr-ui-Th,.smarthr-ui-Td)]:shr-border-dashed',
      },
    },
    rounded: {
      true: {
        table: ROUNDED_ALL,
      },
      all: {
        table: ROUNDED_ALL,
      },
      top: {
        table: [ROUNDED.t_l, ROUNDED.t_r],
      },
      right: {
        table: [ROUNDED.t_r, ROUNDED.b_r],
      },
      bottom: {
        table: [ROUNDED.b_l, ROUNDED.b_r],
      },
      left: {
        table: [ROUNDED.t_l, ROUNDED.b_l],
      },
    },
    layout: {
      auto: {},
      fixed: {
        table: 'shr-table-fixed',
      },
    },
    fixedHead: {
      true: {
        table:
          '[&_tbody]:shr-relative [&_tbody]:shr-z-1 [&_thead]:shr-sticky [&_thead]:shr-start-0 [&_thead]:shr-top-0 [&_thead]:shr-z-[2]',
      },
    },
  },
  compoundVariants: [
    {
      borderType: ['vertical', 'both', 'all'],
      className: {
        table: [
          '[&_:is(.smarthr-ui-Th:not(:first-child),.smarthr-ui-Td:not(:first-child))]:shr-border-l',
          '[&_:is(.smarthr-ui-Th:not(:first-child),.smarthr-ui-Td:not(:first-child))]:shr-border-l-default',
        ],
      },
    },
    {
      borderType: ['horizontal', 'both', 'all'],
      className: {
        table: [
          // thead がある場合は、thead 配下以外の th と td に border-t を適用
          [
            '[&:has(thead)_tr:not(:where(thead_tr))_:is(.smarthr-ui-Th,.smarthr-ui-Td)]:shr-border-t',
            '[&:has(thead)_tr:not(:where(thead_tr))_:is(.smarthr-ui-Th,.smarthr-ui-Td)]:shr-border-t-default',
          ],
          // thead がない場合は、最初以外の tr 配下の th と td に border-t を適用
          [
            '[&:not(:has(thead))_tr:not(:first-of-type)_:is(.smarthr-ui-Th,.smarthr-ui-Td)]:shr-border-t',
            '[&:not(:has(thead))_tr:not(:first-of-type)_:is(.smarthr-ui-Th,.smarthr-ui-Td)]:shr-border-t-default',
          ],
        ],
      },
    },
  ],
  defaultVariants: {
    borderType: 'horizontal',
    borderStyle: 'solid',
    layout: 'auto',
    fixedHead: false,
  },
})

export const Table: FC<Props> = ({
  borderType,
  borderStyle,
  fixedHead,
  layout,
  rounded,
  className,
  reel = true,
  ...rest
}) => {
  const tableWrapperRef = useRef<HTMLDivElement>(null)
  const classNames = useMemo(() => {
    const { table } = classNameGenerator({
      borderType,
      borderStyle,
      fixedHead,
      layout,
      rounded,
      className,
    })
    return { table: table({ className }) }
  }, [borderType, borderStyle, className, fixedHead, layout, rounded])

  const renderedTable = <table {...rest} className={classNames.table} />

  return (
    <TableScrollContext ref={tableWrapperRef} fixedHead={fixedHead}>
      {reel ? (
        <TableReel tableWrapperRef={tableWrapperRef}>{renderedTable}</TableReel>
      ) : (
        renderedTable
      )}
    </TableScrollContext>
  )
}
