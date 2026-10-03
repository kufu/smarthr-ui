import { ScrollerSwitcher } from './ScrollerSwitcher'

import type { ComponentPropsWithoutRef, FC, PropsWithChildren } from 'react'

type BaseProps = PropsWithChildren<{
  fixedHead?: boolean
}>
type Props = BaseProps & Omit<ComponentPropsWithoutRef<'div'>, keyof BaseProps>

export const TableScroller: FC<Props> = ({ children, fixedHead, ...rest }) => (
  <ScrollerSwitcher {...rest} fixedHead={fixedHead}>
    {children}
  </ScrollerSwitcher>
)
