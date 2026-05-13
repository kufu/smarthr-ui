import {
  type PropsWithoutRef,
  type ReactNode,
  type Ref,
  type RefAttributes,
  forwardRef,
} from 'react'

/** forwardRef でジェネリクスを使うためのラッパー
 * via https://www.totaltypescript.com/forwardref-with-generic-components */
export const genericsForwardRef = <T, P = object>(
  render: (props: PropsWithoutRef<P>, ref: Ref<T>) => ReactNode,
): ((props: P & RefAttributes<T>) => ReactNode) => forwardRef(render) as any
