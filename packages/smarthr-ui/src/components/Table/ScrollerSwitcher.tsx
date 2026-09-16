import { Scroller } from '../Scroller'

// HINT: client/index.ts経由だとTableReelの再export分も巻き込まれ、
// TableReel.tsx(../ScrollerSwitcherを直接import)との間で循環依存になるため直接importする
// eslint-disable-next-line smarthr/require-barrel-import
import { FixedHeadTableScroller } from './client/FixedHeadTableScroller'

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
