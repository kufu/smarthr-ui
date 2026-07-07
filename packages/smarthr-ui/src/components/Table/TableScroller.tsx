'use client'

import {
  type ComponentPropsWithRef,
  type ForwardedRef,
  type PropsWithChildren,
  forwardRef,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react'
import { tv } from 'tailwind-variants'

import { defaultHtmlFontSize } from '../../themes'
import { Scroller } from '../Scroller'

type Props = PropsWithChildren &
  Omit<ComponentPropsWithRef<'div'>, keyof PropsWithChildren> & {
    fixedHead?: boolean
  }

const classNameGenerator = tv({
  slots: {
    // fixedHead のとき、スクロールインスタンスがTableからWrapperに変わるため、Wrapperに対して高さとoverflowを指定する
    wrapper: 'shr-h-[inherit] shr-max-h-[inherit] shr-scroll-pb-0.5',
  },
})

export const TableScroller = forwardRef<HTMLDivElement, Props>(
  ({ children, fixedHead, ...rest }, forwardedRef: ForwardedRef<HTMLDivElement>) => {
    const classNames = useMemo(() => {
      const { wrapper } = classNameGenerator()

      return {
        wrapper: wrapper(),
      }
    }, [])

    if (fixedHead) {
      return (
        <FixedHeadTableScroller
          {...rest}
          forwardedRef={forwardedRef}
          className={classNames.wrapper}
        >
          {children}
        </FixedHeadTableScroller>
      )
    }

    return (
      <Scroller {...rest} ref={forwardedRef} direction="both" className={classNames.wrapper}>
        {children}
      </Scroller>
    )
  },
)

type FixedHeadTableScrollerProps = PropsWithChildren &
  Omit<ComponentPropsWithRef<'div'>, keyof PropsWithChildren> & {
    forwardedRef: ForwardedRef<HTMLDivElement>
  }

const FixedHeadTableScroller = ({
  children,
  forwardedRef,
  ...rest
}: FixedHeadTableScrollerProps) => {
  const innerRef = useRef<HTMLDivElement | null>(null)

  const setRefs = (node: HTMLDivElement) => {
    innerRef.current = node
    if (forwardedRef) {
      if (typeof forwardedRef === 'function') {
        forwardedRef(node)
      } else {
        forwardedRef.current = node
      }
    }
  }

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
    <Scroller {...rest} ref={setRefs} direction="both">
      {children}
    </Scroller>
  )
}
