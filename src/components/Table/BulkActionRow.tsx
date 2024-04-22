import React, { ComponentPropsWithRef, FC, PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useTableHeadCellCount } from './useTableHeadCellCount'

const bulkActionRow = tv({
  slots: {
    wrapper: 'smarthr-ui-BulkActionRow',
    cell: 'shr-bg-action-background shr-p-1 shr-text-base',
  },
})

export const BulkActionRow: FC<PropsWithChildren<ComponentPropsWithRef<'tr'>>> = ({
  children,
  className,
  ...props
}) => {
  const { countHeadCellRef, count } = useTableHeadCellCount<HTMLTableRowElement>()

  const { wrapperStyle, cellStyle } = useMemo(() => {
    const { wrapper, cell } = bulkActionRow()
    return {
      wrapperStyle: wrapper({ className }),
      cellStyle: cell(),
    }
  }, [className])

  return (
    <tr {...props} ref={countHeadCellRef} className={wrapperStyle}>
      <td colSpan={count} className={cellStyle}>
        {children}
      </td>
    </tr>
  )
}
