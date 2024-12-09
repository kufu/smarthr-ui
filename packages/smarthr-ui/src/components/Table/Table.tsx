import React, { ComponentProps, FC, PropsWithChildren, useMemo } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

type Props = PropsWithChildren<VariantProps<typeof table>>
type ElementProps = Omit<ComponentProps<'table'>, keyof Props>

const table = tv({
  base: [
    'smarthr-ui-Table',
    'shr-border-collapse shr-w-full',
    '[&_tbody]:shr-bg-white',
    '[&_th]:contrast-more:shr-border-shorthand [&_th]:shr-bg-head [&_th]:contrast-more:shr-border-high-contrast',
    '[&_td]:contrast-more:shr-border-shorthand [&_td]:contrast-more:shr-border-high-contrast',
    'contrast-more:shr-border-shorthand contrast-more:shr-border-high-contrast',
  ],
  variants: {
    borderType: {
      horizontal: 'shr-table-border-horizontal',
      both: 'shr-table-border-vertical shr-table-border-horizontal',
    },
    layout: {
      auto: '',
      fixed: 'shr-table-fixed',
    },
    fixedHead: {
      true: '[&_thead]:shr-sticky [&_thead]:shr-start-0 [&_thead]:shr-top-0 [&_thead]:shr-z-1',
    },
  },
  defaultVariants: {
    borderType: 'horizontal',
    layout: 'auto',
    fixedHead: false,
  },
})

export const Table: FC<Props & ElementProps> = ({
  borderType,
  fixedHead,
  layout,
  className,
  ...props
}) => {
  const styles = useMemo(
    () => table({ borderType, fixedHead, layout, className }),
    [borderType, className, fixedHead, layout],
  )
  return <table {...props} className={styles} />
}
