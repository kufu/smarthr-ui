'use client'

import { useMergeRefs } from '../../../hooks/client/useMergeRefs'
import { defaultHtmlFontSize } from '../../../themes'
import { Scroller } from '../../Scroller'

import type { SHRComponentPropsWithRef } from '../../../types'
import type { FC } from 'react'

type Props = SHRComponentPropsWithRef<
  'div',
  {
    direction: 'both'
  }
>

// thead の高さ分だけ scroll-padding-top を設定
const callbackRef = (node: HTMLElement | null) => {
  if (!node) {
    return
  }

  const thead = node.querySelector('thead')

  if (thead) {
    const { height } = thead.getBoundingClientRect()

    node.style.scrollPaddingTop = `${height + defaultHtmlFontSize}px`
  }
}

export const FixedHeadTableScroller: FC<Props> = ({ children, ref, direction, ...rest }) => {
  const mergedRef = useMergeRefs(callbackRef, ref)

  return (
    <Scroller {...rest} ref={mergedRef} direction={direction}>
      {children}
    </Scroller>
  )
}
