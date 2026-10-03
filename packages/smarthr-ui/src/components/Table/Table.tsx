import { ActualTable } from './ActualTable'
import { TableScroller } from './TableScroller'
import { TableReel } from './client'

import type { ComponentProps, FC } from 'react'

type BaseProps = {
  reel?: boolean
}
type Props = BaseProps & Omit<ComponentProps<typeof ActualTable>, keyof BaseProps>

export const Table: FC<Props> = ({ reel = true, fixedHead, children, ...rest }) => {
  const Component = reel ? TableReel : TableScroller

  return (
    <Component fixedHead={fixedHead}>
      <ActualTable {...rest} fixedHead={fixedHead}>
        {children}
      </ActualTable>
    </Component>
  )
}
