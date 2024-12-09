'use client'

import React, { ComponentPropsWithRef, FC, PropsWithChildren } from 'react'
import { tv } from 'tailwind-variants'

import { useTableHeadCellCount } from './useTableHeadCellCount'

const bulkActionRow = tv({
  slots: {
    wrapper: 'smarthr-ui-BulkActionRow',
    cell: [
      'shr-bg-action-background shr-p-1 shr-text-base',
      'forced-colors:shr-border-t-shorthand',
    ],
  },
})

export const BulkActionRow: FC<PropsWithChildren<ComponentPropsWithRef<'tr'>>> = ({
  children,
  className,
  ...props
}) => {
  const { countHeadCellRef, count } = useTableHeadCellCount<HTMLTableRowElement>()

  const { wrapper, cell } = bulkActionRow()

  return (
    <tr {...props} ref={countHeadCellRef} className={wrapper({ className })}>
      <td colSpan={count} className={cell()}>
        {children}
      </td>
    </tr>
  )
}
