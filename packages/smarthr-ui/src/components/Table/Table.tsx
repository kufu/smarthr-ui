import { type ComponentProps, type FC, Fragment, type PropsWithChildren, useMemo } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { Base } from '../Base'

import { TableReel } from './TableReel'

type Props = PropsWithChildren<VariantProps<typeof classNameGenerator>>
type ElementProps = Omit<ComponentProps<'table'>, keyof Props>

const classNameGenerator = tv({
  slots: {
    wrapper: '',
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
      true: {},
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
      // rounded のとき Wrapper である Base に装飾するため、Table には装飾しない
      borderType: ['outer', 'all'],
      rounded: true,
      className: {
        table: 'shr-border-none',
        wrapper: 'shr-border-shorthand',
      },
    },
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

export const Table: FC<Props & ElementProps> = ({
  borderType,
  borderStyle,
  fixedHead,
  layout,
  rounded,
  className,
  ...rest
}) => {
  const classNames = useMemo(() => {
    const { table, wrapper } = classNameGenerator({
      borderType,
      borderStyle,
      fixedHead,
      layout,
      rounded,
      className,
    })
    return { table: table({ className }), wrapper: wrapper() }
  }, [borderType, borderStyle, className, fixedHead, layout, rounded])
  const [Wrapper, wrapperProps] = useMemo(
    () => (rounded ? [RoundedWrapper, { className: classNames.wrapper }] : [Fragment]),
    [rounded, classNames.wrapper],
  )

  return (
    <Wrapper {...wrapperProps}>
      <table {...rest} className={classNames.table} />
    </Wrapper>
  )
}

const RoundedWrapper = ({ children, className }: PropsWithChildren<{ className?: string }>) => (
  <Base className={className} overflow="hidden" layer={0}>
    <TableReel>{children}</TableReel>
  </Base>
)
