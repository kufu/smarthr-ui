import {
  Children,
  type PropsWithoutRef,
  type ReactNode,
  type Ref,
  type RefAttributes,
  forwardRef,
  isValidElement,
} from 'react'

export const includeDisabledTrigger = (trigger: ReactNode) =>
  Children.map(trigger, (t) => isValidElement(t) && t.props.disabled)?.some((bool: boolean) => bool)

/** forwardRef でジェネリクスを使うためのラッパー
 * via https://www.totaltypescript.com/forwardref-with-generic-components */
export const genericsForwardRef = <T, P = object>(
  render: (props: PropsWithoutRef<P>, ref: Ref<T>) => ReactNode,
): ((props: P & RefAttributes<T>) => ReactNode) => forwardRef(render) as any
