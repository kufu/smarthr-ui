'use client'

import {
  type ComponentPropsWithRef,
  type ForwardedRef,
  type PropsWithChildren,
  forwardRef,
  useCallback,
  useLayoutEffect,
  useRef,
} from 'react'

import { defaultHtmlFontSize } from '../../themes'
import { Scroller } from '../Scroller'

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
  ({ children, fixedHead, ...rest }, forwardedRef: ForwardedRef<HTMLDivElement>) =>
    fixedHead ? (
      <FixedHeadTableScroller {...rest} {...SCROLLER_PROPS} forwardedRef={forwardedRef}>
        {children}
      </FixedHeadTableScroller>
    ) : (
      <Scroller {...rest} {...SCROLLER_PROPS} ref={forwardedRef}>
        {children}
      </Scroller>
    ),
)

type FixedHeadTableScrollerProps = PropsWithChildren &
  Omit<ComponentPropsWithRef<'div'>, keyof PropsWithChildren> & {
    forwardedRef: ForwardedRef<HTMLDivElement>
    direction: 'both'
  }

const FixedHeadTableScroller = ({
  children,
  forwardedRef,
  direction,
  ...rest
}: FixedHeadTableScrollerProps) => {
  const innerRef = useRef<HTMLDivElement | null>(null)

  const setRefs = useCallback(
    (node: HTMLDivElement) => {
      innerRef.current = node
      if (forwardedRef) {
        if (typeof forwardedRef === 'function') {
          forwardedRef(node)
        } else {
          forwardedRef.current = node
        }
      }
    },
    [forwardedRef],
  )

  // thead の高さ分だけ scroll-padding-top を設定
  useLayoutEffect(() => {
    if (!innerRef.current) return
    const thead = innerRef.current.querySelector('thead')
    if (thead) {
      const { height } = thead.getBoundingClientRect()
      innerRef.current.style.scrollPaddingTop = `${height + defaultHtmlFontSize}px`
    }
  }, [])

  return (
    <Scroller {...rest} ref={setRefs} direction={direction}>
      {children}
    </Scroller>
  )
}
