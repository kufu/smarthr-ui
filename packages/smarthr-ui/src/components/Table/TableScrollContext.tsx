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

import { defaultHtmlFontSize } from '../../themes/createFontSize'

type Props = PropsWithChildren &
  Omit<ComponentPropsWithRef<'div'>, keyof PropsWithChildren> & {
    fixedHead?: boolean
  }

const classNameGenerator = tv({
  slots: {
    // fixedHead のとき、スクロールインスタンスがTableからWrapperに変わるため、Wrapperに対して高さとoverflowを指定する
    wrapper: 'shr-h-[inherit] shr-max-h-[inherit] shr-scroll-pb-0.5 shr-overflow-y-auto',
  },
})

export const TableScrollContext = forwardRef<HTMLDivElement, Props>(
  ({ className, children, fixedHead, ...rest }, forwardedRef: ForwardedRef<HTMLDivElement>) => {
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
      <div {...rest} ref={setRefs} className={classNames.wrapper}>
        {children}
      </div>
    )
  },
)
