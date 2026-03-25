'use client'

import {
  type ComponentPropsWithoutRef,
  type ComponentType,
  type PropsWithChildren,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { debounce } from '../../libs/debounce'
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
  defaultVariants: {
    direction: 'vertical',
    styleType: 'auto',
  },
})

export const Scroller = forwardRef<HTMLDivElement, Props>(
  ({ as: Component = 'div', direction, styleType, className, children, ...rest }, ref) => {
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

    const autoTabIndex = useCallback(() => {
      let nextTabIndex: 0 | undefined = undefined
      const refCurrent = wrapperRef.current

      if (refCurrent) {
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
      }

      setTabIndex(nextTabIndex)
    }, [direction])

    useEffect(() => {
      autoTabIndex()
    }, [children, autoTabIndex])

    useEffect(() => {
      const debouncedAction = debounce(autoTabIndex, 100)

      window.addEventListener('resize', debouncedAction)

      return () => {
        window.removeEventListener('resize', debouncedAction)
      }
    }, [autoTabIndex])

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
