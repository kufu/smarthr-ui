import { ActualTable } from './ActualTable'
import { TableScroller } from './TableScroller'
import { TableReel } from './client'

import type { SHRComponentPropsWithRef } from '../../types'
import type { FC } from 'react'

type Props = SHRComponentPropsWithRef<
  typeof ActualTable,
  {
    reel?: boolean
  }
>

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
