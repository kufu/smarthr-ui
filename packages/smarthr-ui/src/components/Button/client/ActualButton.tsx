'use client'

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
    inner: string
  }
  // HINT: loading中かどうかはloaderの有無で判定する。要素の生成自体は呼び出し元(Button.tsx)が行う
  loader?: ReactNode
  buttonRef?: ForwardedRef<HTMLButtonElement>
  prefix?: ReactNode
  suffix?: ReactNode
}>

export type Props = BaseProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>

export const ActualButton: FC<Props> = ({
  classNames,
  loader,
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

  if (loader) {
    actualPrefix = undefined

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

  return (
    // eslint-disable-next-line smarthr/best-practice-for-button-element
    <button
      {...rest}
      ref={buttonRef}
      className={classNames.wrapper}
      aria-disabled={disabled}
      data-loading={loader ? true : undefined}
      onClick={disabled ? EVENT_CANCELLER : onClick}
    >
      {actualPrefix}
      <span
        ref={callbackRef}
        className={classNames.inner}
        data-only-body={dataOnlyBodyAttr}
        data-square={square || undefined}
      >
        {actualChildren}
      </span>
      {actualSuffix}
    </button>
  )
}
