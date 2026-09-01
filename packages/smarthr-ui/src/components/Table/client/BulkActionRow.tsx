'use client'

import { type ComponentPropsWithRef, type FC, type PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useTableHeadCellCount } from './useTableHeadCellCount'

const classNameGenerator = tv({
  slots: {
    wrapper: 'smarthr-ui-BulkActionRow',
    cell: [
      'shr-bg-action-background shr-p-1 shr-text-base',
      'forced-colors:shr-border-t-shorthand',
      '[&_.smarthr-ui-Button.shr-text-link]:shr-text-link-darken',
    ],
  },
})

export const BulkActionRow: FC<PropsWithChildren<ComponentPropsWithRef<'tr'>>> = ({
  children,
  className,
  ...rest
}) => {
  const { countHeadCellRef, count } = useTableHeadCellCount<HTMLTableRowElement>()

  const classNames = useMemo(() => {
    const { wrapper, cell } = classNameGenerator()

    return {
      wrapper: wrapper({ className }),
      cell: cell(),
    }
  }, [className])

  return (
    <tr {...rest} ref={countHeadCellRef} className={classNames.wrapper}>
      <td colSpan={count} className={classNames.cell}>
        {children}
      </td>
    </tr>
  )
}
