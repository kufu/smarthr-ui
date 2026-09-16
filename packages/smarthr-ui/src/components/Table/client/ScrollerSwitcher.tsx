import { Scroller } from '../../Scroller'

import { FixedHeadTableScroller } from './FixedHeadTableScroller'

import type { ComponentPropsWithRef, FC, ForwardedRef, PropsWithChildren } from 'react'

type Props = PropsWithChildren &
  Omit<ComponentPropsWithRef<'div'>, keyof PropsWithChildren> & {
    fixedHead?: boolean
    forwardedRef: ForwardedRef<HTMLDivElement>
  }

const SCROLLER_PROPS = {
  direction: 'both' as const,
  // fixedHead のとき、スクロールインスタンスがTableからWrapperに変わるため、Wrapperに対して高さとoverflowを指定する
  className: 'shr-h-[inherit] shr-max-h-[inherit] shr-scroll-pb-0.5',
}

export const ScrollerSwitcher: FC<Props> = ({ children, fixedHead, forwardedRef, ...rest }) =>
  fixedHead ? (
    <FixedHeadTableScroller {...rest} {...SCROLLER_PROPS} forwardedRef={forwardedRef}>
      {children}
    </FixedHeadTableScroller>
  ) : (
    <Scroller {...rest} {...SCROLLER_PROPS} ref={forwardedRef}>
      {children}
    </Scroller>
  )
