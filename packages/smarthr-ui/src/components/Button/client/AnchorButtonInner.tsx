'use client'

import { useSquareDetection } from './useSquareDetection'

import type { SHRComponentPropsWithoutRef } from '../../../types'
import type { FC, ReactNode } from 'react'

type Props = SHRComponentPropsWithoutRef<
  'span',
  {
    prefix?: ReactNode
    suffix?: ReactNode
  }
>

// HINT: 外側のa要素はAnchorButton.tsx(Server Component)側が描画する。このコンポーネントは
// square検出のためにclient境界が必要なinner span部分だけに切り詰めている
export const AnchorButtonInner: FC<Props> = ({ prefix, suffix, children, ...rest }) => {
  const { square, callbackRef, dataOnlyBodyAttr } = useSquareDetection({ prefix, suffix })

  return (
    <span
      {...rest}
      ref={callbackRef}
      data-only-body={dataOnlyBodyAttr}
      data-square={square || undefined}
    >
      {children}
    </span>
  )
}
