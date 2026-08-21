'use client'

import {
  type ComponentPropsWithoutRef,
  type ComponentType,
  type PropsWithChildren,
  forwardRef,
  useMemo,
  useRef,
  useState,
} from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { useMergeRefs } from '../../hooks/useMergeRefs'
import { useSectionWrapper } from '../SectioningContent'

type BaseProps = PropsWithChildren<
  VariantProps<typeof classNameGenerator> & {
    as?: string | ComponentType<any>
  }
>
type Props = BaseProps & Omit<ComponentPropsWithoutRef<'div'>, keyof BaseProps | 'tabIndex'>

const classNameGenerator = tv({
  base: 'smarthr-ui-Scroller',
  variants: {
    direction: {
      horizontal: '',
      vertical: '',
      both: '',
    },
    styleType: {
      auto: '',
      scroll: '',
    },
  },
  compoundVariants: [
    {
      direction: 'vertical',
      styleType: 'auto',
      className: 'shr-overflow-y-auto shr-overflow-x-hidden',
    },
    {
      direction: 'horizontal',
      styleType: 'auto',
      className: 'shr-overflow-x-auto shr-overflow-y-hidden',
    },
    {
      direction: 'both',
      styleType: 'auto',
      className: 'shr-overflow-auto',
    },
    {
      direction: 'vertical',
      styleType: 'scroll',
      className: 'shr-overflow-x-hidden shr-overflow-y-scroll',
    },
    {
      direction: 'horizontal',
      styleType: 'scroll',
      className: 'shr-overflow-y-hidden shr-overflow-x-scroll',
    },
    {
      direction: 'both',
      styleType: 'scroll',
      className: 'shr-overflow-scroll',
    },
  ],
})

export const Scroller = forwardRef<HTMLDivElement, Props>(
  (
    {
      as: Component = 'div',
      direction = 'vertical',
      styleType = 'auto',
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const innerRef = useRef<HTMLDivElement | null>(null)
    const [tabIndex, setTabIndex] = useState<0 | undefined>(undefined)

    const actualClassName = useMemo(
      () =>
        classNameGenerator({
          direction,
          styleType,
          className,
        }),
      [direction, styleType, className],
    )

    const functions = useMemo(() => {
      const autoTabIndex = () => {
        const refCurrent = innerRef.current

        if (!refCurrent) return

        let nextTabIndex: 0 | undefined = undefined

        switch (direction) {
          case 'vertical':
            nextTabIndex = refCurrent.scrollHeight > refCurrent.clientHeight ? 0 : undefined
            break
          case 'horizontal':
            nextTabIndex = refCurrent.scrollWidth > refCurrent.clientWidth ? 0 : undefined
            break
          case 'both':
            nextTabIndex =
              refCurrent.scrollHeight > refCurrent.clientHeight ||
              refCurrent.scrollWidth > refCurrent.clientWidth
                ? 0
                : undefined
            break
        }

        setTabIndex(nextTabIndex)
      }

      let resizeObserver: ResizeObserver

      return {
        callbackRef: (node: HTMLDivElement | null) => {
          autoTabIndex()

          if (node) {
            resizeObserver ??= new ResizeObserver(autoTabIndex)
            resizeObserver.observe(node)
          } else {
            resizeObserver?.disconnect()
          }
        },
      }
    }, [direction])

    // HINT: useMergeRefsはv18でもcallbackRefのcleanup関数に対応している
    // もしuseMergeRefsをなくす場合、react v18対応が不要になっているかどうか確認する
    const mergedRef = useMergeRefs(innerRef, functions.callbackRef, ref)

    const Wrapper = useSectionWrapper(Component)
    const body = (
      <Component {...rest} ref={mergedRef} tabIndex={tabIndex} className={actualClassName}>
        {children}
      </Component>
    )

    if (Wrapper) {
      return <Wrapper>{body}</Wrapper>
    }

    return body
  },
)
