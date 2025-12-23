'use client'

import {
  type ComponentPropsWithRef,
  type FC,
  type PropsWithChildren,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react'
import { tv } from 'tailwind-variants'

import { defaultHtmlFontSize } from '../../themes/createFontSize'

type Props = PropsWithChildren & Omit<ComponentPropsWithRef<'div'>, keyof PropsWithChildren>

const classNameGenerator = tv({
  slots: {
    // fixedHead のとき、スクロールインスタンスがTableからWrapperに変わるため、Wrapperに対して高さとoverflowを指定する
    wrapper: 'shr-h-[inherit] shr-max-h-[inherit] shr-overflow-y-scroll',
  },
})

export const TableFixedHead: FC<Props> = ({ className, children, ...props }) => {
  const tableWrapperRef = useRef<HTMLDivElement>(null)
  const classNames = useMemo(() => {
    const { wrapper } = classNameGenerator()

    return {
      wrapper: wrapper(),
    }
  }, [])

  // fixedHead 時に thead の高さ分だけ scroll-padding-top を正しい高さをに設定できるように、Tableのtheadがある場合のみで計算する
  useLayoutEffect(() => {
    if (tableWrapperRef.current) {
      const thead = tableWrapperRef.current.querySelector('thead')
      if (thead) {
        const { height } = thead.getBoundingClientRect()
        tableWrapperRef.current.style.scrollPaddingTop = `${height + defaultHtmlFontSize}px`
      }
    }
  }, [])

  return (
    <div {...props} ref={tableWrapperRef} className={classNames.wrapper}>
      {children}
    </div>
  )
}
