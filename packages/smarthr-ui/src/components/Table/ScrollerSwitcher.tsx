import { type FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Scroller } from '../Scroller'

// HINT: client/index.ts経由だとTableReelの再export分も巻き込まれ、
// TableReel.tsx(../ScrollerSwitcherを直接import)との間で循環依存になるため直接importする
// eslint-disable-next-line smarthr/require-barrel-import
import { FixedHeadTableScroller } from './client/FixedHeadTableScroller'

import type { ExtendElementPropsWithRef } from '../../types'

export type Rounded = boolean | 'all' | 'top' | 'right' | 'bottom' | 'left'

type Props = ExtendElementPropsWithRef<
  'div',
  {
    fixedHead?: boolean
    rounded?: Rounded
  }
>

const classNameGenerator = tv({
  // fixedHead のとき、スクロールインスタンスがTableからWrapperに変わるため、Wrapperに対して高さとoverflowを指定する
  base: 'shr-h-[inherit] shr-max-h-[inherit] shr-scroll-pb-0.5',
  variants: {
    // HINT: 角丸はセル単位ではなくスクロール領域に付ける。スクロール領域(overflow: auto)が中身を角丸の形で切るため、
    //       theadの有無・colSpan・スクロール位置などに関係なく、見えている角が常に丸まる
    rounded: {
      true: 'shr-rounded-l',
      all: 'shr-rounded-l',
      top: 'shr-rounded-t-l',
      right: 'shr-rounded-r-l',
      bottom: 'shr-rounded-b-l',
      left: 'shr-rounded-l-l',
    } satisfies Record<Exclude<Rounded, boolean> | 'true', string>,
  },
})

export const ScrollerSwitcher: FC<Props> = ({ children, fixedHead, rounded, ...rest }) => {
  const className = useMemo(() => classNameGenerator({ rounded }), [rounded])

  return fixedHead ? (
    <FixedHeadTableScroller {...rest} direction="both" className={className}>
      {children}
    </FixedHeadTableScroller>
  ) : (
    <Scroller {...rest} direction="both" className={className}>
      {children}
    </Scroller>
  )
}
