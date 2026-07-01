'use client'

import {
  type ComponentPropsWithoutRef,
  type ComponentType,
  type PropsWithChildren,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { useSectionWrapper } from '../SectioningContent'

type AbstractProps = PropsWithChildren<
  VariantProps<typeof classNameGenerator> & {
    as?: string | ComponentType<any>
  }
>
type Props = AbstractProps & Omit<ComponentPropsWithoutRef<'div'>, keyof AbstractProps | 'tabIndex'>

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
    const wrapperRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => wrapperRef.current!)

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

    useEffect(() => {
      const refCurrent = wrapperRef.current
      if (!refCurrent) return

      const autoTabIndex = () => {
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

      autoTabIndex()

      const resizeObserver = new ResizeObserver(autoTabIndex)
      resizeObserver.observe(refCurrent)

      return () => {
        resizeObserver.unobserve(refCurrent)
      }
    }, [direction])

    const Wrapper = useSectionWrapper(Component)
    const body = (
      <Component {...rest} ref={wrapperRef} className={actualClassName} tabIndex={tabIndex}>
        {children}
      </Component>
    )

    if (Wrapper) {
      return <Wrapper>{body}</Wrapper>
    }

    return body
  },
)
