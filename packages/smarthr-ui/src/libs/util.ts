import React, {
  type FC,
  type PropsWithoutRef,
  type Ref,
  type RefAttributes,
  forwardRef,
} from 'react'

export const includeDisabledTrigger = (trigger: React.ReactNode) =>
  React.Children.map(trigger, (t) => React.isValidElement(t) && t.props.disabled)?.some(
    (bool: boolean) => bool,
  )

type Element = ReturnType<FC>

/** forwardRef でジェネリクスを使うためのラッパー
 * via https://www.totaltypescript.com/forwardref-with-generic-components */
export const genericsForwardRef = <T, P = object>(
  render: (props: PropsWithoutRef<P>, ref: Ref<T>) => Element,
): ((props: P & RefAttributes<T>) => Element) => forwardRef(render) as any
