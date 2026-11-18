import { ScrollerSwitcher } from './ScrollerSwitcher'

import type { Rounded } from './ScrollerSwitcher'
import type { ExtendElementPropsWithoutRef } from '../../types'
import type { FC } from 'react'

type Props = ExtendElementPropsWithoutRef<
  'div',
  {
    fixedHead?: boolean
    rounded?: Rounded
  }
>

export const TableScroller: FC<Props> = ({ children, fixedHead, ...rest }) => (
  <ScrollerSwitcher {...rest} fixedHead={fixedHead}>
    {children}
  </ScrollerSwitcher>
)
