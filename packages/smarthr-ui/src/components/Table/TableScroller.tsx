'use client'

import {
  type ComponentPropsWithRef,
  type ForwardedRef,
  type PropsWithChildren,
  forwardRef,
  useCallback,
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
  // TODO: useMergeRefsが作成されたら修正する
  const callbackRef = useCallback(
    (node: HTMLDivElement | null) => {
      // thead の高さ分だけ scroll-padding-top を設定
      if (node) {
        const thead = node.querySelector('thead')

        if (thead) {
          const { height } = thead.getBoundingClientRect()

          node.style.scrollPaddingTop = `${height + defaultHtmlFontSize}px`
        }
      }

      if (forwardedRef) {
        if (typeof forwardedRef === 'function') {
          // React 19 では callback ref の戻り値を cleanup として使うため、返却する
          forwardedRef(node)
        } else {
          forwardedRef.current = node
        }
      }
    },
    [forwardedRef],
  )

  return (
    <Scroller {...rest} ref={callbackRef} direction={direction}>
      {children}
    </Scroller>
  )
}
