import { ScrollerSwitcher } from './ScrollerSwitcher'

import type { SHRComponentPropsWithoutRef } from '../../types'
import type { FC } from 'react'

type Props = SHRComponentPropsWithoutRef<
  'div',
  {
    fixedHead?: boolean
  }
>

export const TableScroller: FC<Props> = ({ children, fixedHead, ...rest }) => (
  <ScrollerSwitcher {...rest} fixedHead={fixedHead}>
    {children}
  </ScrollerSwitcher>
)
