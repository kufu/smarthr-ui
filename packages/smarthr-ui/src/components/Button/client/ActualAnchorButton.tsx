'use client'

import { useSquareDetection } from './useSquareDetection'

import type {
  AnchorHTMLAttributes,
  ElementType,
  FC,
  ForwardedRef,
  PropsWithChildren,
  ReactNode,
} from 'react'

type BaseProps = PropsWithChildren<{
  classNames: {
    wrapper: string
    inner: string
  }
  elementAs?: ElementType
  prefix?: ReactNode
  suffix?: ReactNode
  anchorRef?: ForwardedRef<HTMLAnchorElement>
}>

export type Props = BaseProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps>

export const ActualAnchorButton: FC<Props> = ({
  classNames,
  elementAs,
  anchorRef,
  prefix,
  suffix,
  children,
  ...rest
}) => {
  const { square, callbackRef, dataOnlyBodyAttr } = useSquareDetection({ prefix, suffix })
  const Component = elementAs || 'a'

  return (
    <Component {...rest} ref={anchorRef} className={classNames.wrapper}>
      {prefix}
      <span
        ref={callbackRef}
        className={classNames.inner}
        data-only-body={dataOnlyBodyAttr}
        data-square={square || undefined}
      >
        {children}
      </span>
      {suffix}
    </Component>
  )
}
