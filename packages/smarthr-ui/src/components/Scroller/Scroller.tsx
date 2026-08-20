'use client'

import {
  type ComponentPropsWithoutRef,
  type ComponentType,
  type PropsWithChildren,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

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

    // as が切り替わると DOM 要素が変わるため、Component を依存配列に含める
    // TODO: useMergeRefsが実装されたら修正する
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useImperativeHandle(ref, () => innerRef.current!, [Component])

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

      const resizeObserver = new ResizeObserver(autoTabIndex)

      return {
        callbackRef: (node: HTMLDivElement | null) => {
          // TODO: useMergeRefsが実装されたら修正する
          innerRef.current = node

          autoTabIndex()

          if (node) {
            resizeObserver.observe(node)
          } else {
            resizeObserver.disconnect()
          }
        },
      }
    }, [direction])

    const Wrapper = useSectionWrapper(Component)
    const body = (
      <Component
        {...rest}
        ref={functions.callbackRef}
        tabIndex={tabIndex}
        className={actualClassName}
      >
        {children}
      </Component>
    )

    if (Wrapper) {
      return <Wrapper>{body}</Wrapper>
    }

    return body
  },
)
