import { type ComponentPropsWithRef, type PropsWithChildren, forwardRef } from 'react'

import { ScrollerSwitcher } from './ScrollerSwitcher'

type Props = PropsWithChildren &
  Omit<ComponentPropsWithRef<'div'>, keyof PropsWithChildren> & {
    fixedHead?: boolean
  }

export const TableScroller = forwardRef<HTMLDivElement, Props>(
  ({ children, fixedHead, ...rest }, ref) => (
    <ScrollerSwitcher {...rest} forwardedRef={ref} fixedHead={fixedHead}>
      {children}
    </ScrollerSwitcher>
  ),
)
