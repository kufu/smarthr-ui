'use client'

import { useSquareDetection } from './useSquareDetection'

import type { FC, PropsWithChildren, ReactNode } from 'react'

type Props = PropsWithChildren<{
  className: string
  prefix?: ReactNode
  suffix?: ReactNode
}>

// HINT: 外側のa要素はAnchorButton.tsx(Server Component)側が描画する。このコンポーネントは
// square検出のためにclient境界が必要なinner span部分だけに切り詰めている
export const ActualAnchorButton: FC<Props> = ({ className, prefix, suffix, children }) => {
  const { square, callbackRef, dataOnlyBodyAttr } = useSquareDetection({ prefix, suffix })

  return (
    <span
      ref={callbackRef}
      className={className}
      data-only-body={dataOnlyBodyAttr}
      data-square={square || undefined}
    >
      {children}
    </span>
  )
}
