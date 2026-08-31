'use client'

import { type ComponentProps, type FC, useRef } from 'react'

import { ActualTable } from './ActualTable'
import { TableReel } from './TableReel'
import { TableScroller } from './TableScroller'

type BaseProps = ComponentProps<typeof ActualTable> & {
  reel?: boolean
}
type Props = BaseProps & Omit<ComponentProps<'table'>, keyof BaseProps>

export const Table: FC<Props> = ({ reel = true, children, ...rest }) => {
  const Component = reel ? ReeledTable : UnreeledTable

  return <Component {...rest}>{children}</Component>
}

type LocalProps = Omit<Props, 'reel'>

const ReeledTable: FC<LocalProps> = ({ fixedHead, children, ...rest }) => {
  const tableWrapperRef = useRef<HTMLDivElement>(null)

  return (
    <TableScroller ref={tableWrapperRef} fixedHead={fixedHead}>
      <TableReel tableWrapperRef={tableWrapperRef}>
        <ActualTable {...rest} fixedHead={fixedHead}>
          {children}
        </ActualTable>
      </TableReel>
    </TableScroller>
  )
}
const UnreeledTable: FC<LocalProps> = ({ fixedHead, children, ...rest }) => (
  <TableScroller fixedHead={fixedHead}>
    <ActualTable {...rest} fixedHead={fixedHead}>
      {children}
    </ActualTable>
  </TableScroller>
)
