import { ScrollerSwitcher } from './ScrollerSwitcher'

import type { ComponentPropsWithoutRef, FC } from 'react'

type BaseProps = {
  fixedHead?: boolean
}
type Props = BaseProps & Omit<ComponentPropsWithoutRef<'div'>, keyof BaseProps>

export const TableScroller: FC<Props> = ({ children, fixedHead, ...rest }) => (
  <ScrollerSwitcher {...rest} fixedHead={fixedHead}>
    {children}
  </ScrollerSwitcher>
)
