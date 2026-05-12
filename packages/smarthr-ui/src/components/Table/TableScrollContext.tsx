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

export const TableScrollContext = forwardRef<HTMLDivElement, Props>(
  (
    // NOTE: classNameは型上受け取れるが、classNames.wrapperで独自実装しているため使用しない
    // TODO: Props型から除外するか、classNames.wrapperとマージして適切にハンドリングすべき
    { className: _className, children, fixedHead, ...rest },
    forwardedRef: ForwardedRef<HTMLDivElement>,
  ) => {
    const innerRef = useRef<HTMLDivElement | null>(null)
    const classNames = useMemo(() => {
      const { wrapper } = classNameGenerator()

      return {
        wrapper: wrapper(),
      }
    }, [])

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

    // fixedHead 時に thead の高さ分だけ scroll-padding-top を正しい高さをに設定できるように、Tableのtheadがある場合のみで計算する
    useLayoutEffect(() => {
      if (!innerRef.current || !fixedHead) return
      const thead = innerRef.current.querySelector('thead')
      if (thead) {
        const { height } = thead.getBoundingClientRect()
        innerRef.current.style.scrollPaddingTop = `${height + defaultHtmlFontSize}px`
      }
    }, [fixedHead])

    return (
      <Scroller {...rest} ref={setRefs} direction="both" className={classNames.wrapper}>
        {children}
      </Scroller>
    )
  },
)
