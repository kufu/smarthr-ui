'use client'

import { Loader } from '../../Loader'

import { useSquareDetection } from './useSquareDetection'

import type {
  ButtonHTMLAttributes,
  FC,
  ForwardedRef,
  MouseEvent,
  PropsWithChildren,
  ReactNode,
} from 'react'

const EVENT_CANCELLER = (e: MouseEvent<HTMLButtonElement>) => {
  e.preventDefault()
  e.stopPropagation()
}

type BaseProps = PropsWithChildren<{
  classNames: {
    wrapper: string
    loader: string
    inner: string
  }
  $loading?: boolean
  buttonRef?: ForwardedRef<HTMLButtonElement>
  prefix?: ReactNode
  suffix?: ReactNode
}>

export type Props = BaseProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>

export const ActualButton: FC<Props> = ({
  classNames,
  $loading,
  buttonRef,
  prefix,
  suffix,
  children,
  disabled,
  onClick,
  ...rest
}) => {
  const { square, callbackRef, dataOnlyBodyAttr } = useSquareDetection({ prefix, suffix })

  let actualChildren = children
  let actualPrefix = prefix
  let actualSuffix = suffix

  if ($loading) {
    actualPrefix = undefined
    const loader = <Loader role="presentation" size="S" className={classNames.loader} />

    // HINT: squareは null | boolean のため、switchで判定する
    // nullの場合にactualSuffixにloaderを突っ込んでしまうとsquareの計算が狂ってしまう
    switch (square) {
      case true:
        actualChildren = loader
        break
      case false:
        actualSuffix = loader
        break
    }
  }

  const disabledOnLoading = $loading || disabled

  return (
    // eslint-disable-next-line smarthr/best-practice-for-button-element
    <button
      {...rest}
      ref={buttonRef}
      className={classNames.wrapper}
      aria-disabled={disabledOnLoading}
      data-loading={$loading || undefined}
      data-square={square || undefined}
      onClick={disabledOnLoading ? EVENT_CANCELLER : onClick}
    >
      {actualPrefix}
      <span ref={callbackRef} className={classNames.inner} data-only-body={dataOnlyBodyAttr}>
        {actualChildren}
      </span>
      {actualSuffix}
    </button>
  )
}
