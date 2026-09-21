'use client'

import { Td } from '../Td'

import { useTableHeadCellCount } from './useTableHeadCellCount'

import type { FC, PropsWithChildren } from 'react'

type Props = PropsWithChildren<{
  className?: string
}>

export const AutoColSpanTd: FC<Props> = ({ children, className }) => {
  const { countHeadCellRef, count } = useTableHeadCellCount<HTMLTableCellElement>()

  return (
    <Td ref={countHeadCellRef} colSpan={count} className={className}>
      {children}
    </Td>
  )
}
