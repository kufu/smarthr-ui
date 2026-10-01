import { ScrollerSwitcher } from './ScrollerSwitcher'

import type { ComponentPropsWithoutRef, FC, PropsWithChildren } from 'react'

type Props = PropsWithChildren &
  Omit<ComponentPropsWithoutRef<'div'>, keyof PropsWithChildren> & {
    fixedHead?: boolean
  }

export const TableScroller: FC<Props> = ({ children, fixedHead, ...rest }) => (
  <ScrollerSwitcher {...rest} forwardedRef={null} fixedHead={fixedHead}>
    {children}
  </ScrollerSwitcher>
)
