'use client'

import { Td } from '../Td'

import { useTableHeadCellCount } from './useTableHeadCellCount'

import type { ComponentPropsWithoutRef, FC } from 'react'

type Props = Omit<ComponentPropsWithoutRef<typeof Td>, 'colSpan'>

export const AutoColSpanTd: FC<Props> = ({ children, ...rest }) => {
  const { countHeadCellRef, count } = useTableHeadCellCount<HTMLTableCellElement>()

  return (
    <Td {...rest} ref={countHeadCellRef} colSpan={count}>
      {children}
    </Td>
  )
}
