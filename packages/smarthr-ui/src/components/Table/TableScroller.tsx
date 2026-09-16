import {
  type ComponentPropsWithRef,
  type ForwardedRef,
  type PropsWithChildren,
  forwardRef,
} from 'react'

import { ScrollerSwitcher } from './client'

type Props = PropsWithChildren &
  Omit<ComponentPropsWithRef<'div'>, keyof PropsWithChildren> & {
    fixedHead?: boolean
  }

export const TableScroller = forwardRef<HTMLDivElement, Props>(
  ({ children, fixedHead, ...rest }, ref: ForwardedRef<HTMLDivElement>) => (
    <ScrollerSwitcher {...rest} forwardedRef={ref} fixedHead={fixedHead}>
      {children}
    </ScrollerSwitcher>
  ),
)
