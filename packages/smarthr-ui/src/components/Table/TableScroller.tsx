import {
  type ComponentPropsWithRef,
  type ForwardedRef,
  type PropsWithChildren,
  forwardRef,
} from 'react'

import { Scroller } from '../Scroller'

import { FixedHeadTableScroller } from './client/components'

type Props = PropsWithChildren &
  Omit<ComponentPropsWithRef<'div'>, keyof PropsWithChildren> & {
    fixedHead?: boolean
  }

const SCROLLER_PROPS = {
  direction: 'both' as const,
  // fixedHead のとき、スクロールインスタンスがTableからWrapperに変わるため、Wrapperに対して高さとoverflowを指定する
  className: 'shr-h-[inherit] shr-max-h-[inherit] shr-scroll-pb-0.5',
}

export const TableScroller = forwardRef<HTMLDivElement, Props>(
  ({ children, fixedHead, ...rest }, ref: ForwardedRef<HTMLDivElement>) =>
    fixedHead ? (
      <FixedHeadTableScroller {...rest} {...SCROLLER_PROPS} forwardedRef={ref}>
        {children}
      </FixedHeadTableScroller>
    ) : (
      <Scroller {...rest} {...SCROLLER_PROPS} ref={ref}>
        {children}
      </Scroller>
    ),
)
