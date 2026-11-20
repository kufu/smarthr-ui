import { ActualTable } from './ActualTable'
import { TableScroller } from './TableScroller'
import { TableReel } from './client'

import type { Rounded } from './ScrollerSwitcher'
import type { ExtendElementPropsWithRef } from '../../types'
import type { FC } from 'react'

type Props = ExtendElementPropsWithRef<
  typeof ActualTable,
  {
    reel?: boolean
    /** 角丸を適用する範囲 */
    rounded?: Rounded
  }
>

export const Table: FC<Props> = ({ reel = true, fixedHead, rounded, children, ...rest }) => {
  const Component = reel ? TableReel : TableScroller

  return (
    <Component fixedHead={fixedHead} rounded={rounded}>
      <ActualTable {...rest} fixedHead={fixedHead}>
        {children}
      </ActualTable>
    </Component>
  )
}
