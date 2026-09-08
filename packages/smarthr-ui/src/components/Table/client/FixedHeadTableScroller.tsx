'use client'

import {
  type ComponentPropsWithRef,
  type FC,
  type ForwardedRef,
  type PropsWithChildren,
  useCallback,
} from 'react'

import { useMergeRefs } from '../../../hooks/client/useMergeRefs'
import { defaultHtmlFontSize } from '../../../themes'
import { Scroller } from '../../Scroller'

type Props = PropsWithChildren &
  Omit<ComponentPropsWithRef<'div'>, keyof PropsWithChildren> & {
    forwardedRef: ForwardedRef<HTMLDivElement>
    direction: 'both'
  }

export const FixedHeadTableScroller: FC<Props> = ({
  children,
  forwardedRef,
  direction,
  ...rest
}) => {
  const callbackRef = useCallback((node: HTMLDivElement | null) => {
    // thead の高さ分だけ scroll-padding-top を設定
    if (node) {
      const thead = node.querySelector('thead')

      if (thead) {
        const { height } = thead.getBoundingClientRect()

        node.style.scrollPaddingTop = `${height + defaultHtmlFontSize}px`
      }
    }
  }, [])

  const mergedRef = useMergeRefs(callbackRef, forwardedRef)

  return (
    <Scroller {...rest} ref={mergedRef} direction={direction}>
      {children}
    </Scroller>
  )
}
