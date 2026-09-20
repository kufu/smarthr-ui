'use client'

import { useMergeRefs } from '../../../hooks/client/useMergeRefs'
import { defaultHtmlFontSize } from '../../../themes'
import { Scroller } from '../../Scroller'

import type { ComponentPropsWithRef, FC, ForwardedRef, PropsWithChildren } from 'react'

type Props = PropsWithChildren &
  Omit<ComponentPropsWithRef<'div'>, keyof PropsWithChildren> & {
    forwardedRef: ForwardedRef<HTMLDivElement>
    direction: 'both'
  }

// thead の高さ分だけ scroll-padding-top を設定
const callbackRef = (node: HTMLDivElement | null) => {
  if (!node) {
    return
  }

  const thead = node.querySelector('thead')

  if (thead) {
    const { height } = thead.getBoundingClientRect()

    node.style.scrollPaddingTop = `${height + defaultHtmlFontSize}px`
  }
}

export const FixedHeadTableScroller: FC<Props> = ({
  children,
  forwardedRef,
  direction,
  ...rest
}) => {
  // HINT: useMergeRefsはv18でもcallbackRefのcleanup関数に対応している
  // もしuseMergeRefsをなくす場合、react v18対応が不要になっているかどうか確認する
  const mergedRef = useMergeRefs(callbackRef, forwardedRef)

  return (
    <Scroller {...rest} ref={mergedRef} direction={direction}>
      {children}
    </Scroller>
  )
}
