'use client'

import {
  type ComponentPropsWithoutRef,
  type ComponentType,
  type PropsWithChildren,
  forwardRef,
  useCallback,
  useMemo,
} from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { useMergeRefs } from '../../hooks/client/useMergeRefs'
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
    const actualClassName = useMemo(
      () =>
        classNameGenerator({
          direction,
          styleType,
          className,
        }),
      [direction, styleType, className],
    )

    const callbackRef = useCallback(
      (node: HTMLDivElement | null) => {
        if (!node) return

        const autoTabIndex = () => {
          let nextTabIndex: '0' | undefined = undefined

          switch (direction) {
            case 'vertical':
              nextTabIndex = node.scrollHeight > node.clientHeight ? '0' : undefined
              break
            case 'horizontal':
              nextTabIndex = node.scrollWidth > node.clientWidth ? '0' : undefined
              break
            case 'both':
              nextTabIndex =
                node.scrollHeight > node.clientHeight || node.scrollWidth > node.clientWidth
                  ? '0'
                  : undefined
              break
          }

          if (nextTabIndex === undefined) {
            node.removeAttribute('tabIndex')
          } else {
            node.setAttribute('tabIndex', nextTabIndex)
          }
        }

        autoTabIndex()

        const resizeObserver = new ResizeObserver(autoTabIndex)
        resizeObserver.observe(node)

        // HINT: useMergeRefsはv18でもcallbackRefのcleanup関数に対応している
        // もしuseMergeRefsをなくす場合、react v18対応が不要になっているかどうか確認する
        return () => {
          node.removeAttribute('tabIndex')
          resizeObserver.disconnect()
        }
      },
      [direction],
    )

    // HINT: useMergeRefsはv18でもcallbackRefのcleanup関数に対応している
    // もしuseMergeRefsをなくす場合、react v18対応が不要になっているかどうか確認する
    const mergedRef = useMergeRefs(callbackRef, ref)

    const Wrapper = useSectionWrapper(Component)
    const body = (
      <Component {...rest} ref={mergedRef} className={actualClassName}>
        {children}
      </Component>
    )

    return Wrapper ? <Wrapper>{body}</Wrapper> : body
  },
)
