'use client'

import { Loader } from '../../Loader'

import { useSquareDetection } from './useSquareDetection'

import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ElementType,
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
    loader?: string
    inner: string
  }
  $loading?: boolean
  elementAs?: ElementType
  prefix?: ReactNode
  suffix?: ReactNode
}>

type BaseButtonProps = BaseProps & {
  isAnchor?: never
  buttonRef?: ForwardedRef<HTMLButtonElement>
}
type ButtonProps = BaseButtonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps>

type BaseAnchorProps = BaseProps & {
  isAnchor: true
  anchorRef?: ForwardedRef<HTMLAnchorElement>
}
type AnchorProps = BaseAnchorProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseAnchorProps>

export type Props = ButtonProps | AnchorProps

// HINT: 分割代入する引数を調整する場合、以下も調整する
type FilteredProps = 'classNames' | 'prefix' | 'suffix' | 'children' | 'isAnchor'
type FilteredButtonProps = Omit<ButtonProps, FilteredProps>
type FilteredAnchorProps = Omit<AnchorProps, FilteredProps>

export const ActualButton: FC<Props> = ({
  classNames,
  $loading,
  prefix,
  suffix,
  children,
  isAnchor,
  ...rest
}) => {
  const { square, callbackRef, dataOnlyBodyAttr } = useSquareDetection({ prefix, suffix })

  if (isAnchor) {
    // eslint-disable-next-line smarthr/best-practice-for-rest-parameters
    const { anchorRef, elementAs, ...anchorRest } = rest as FilteredAnchorProps
    const Component = elementAs || 'a'

    return (
      <Component
        {...anchorRest}
        ref={anchorRef}
        className={classNames.wrapper}
        data-square={square || undefined}
      >
        {prefix}
        <span ref={callbackRef} className={classNames.inner} data-only-body={dataOnlyBodyAttr}>
          {children}
        </span>
        {suffix}
      </Component>
    )
  }

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

  // eslint-disable-next-line smarthr/best-practice-for-rest-parameters
  const { buttonRef, disabled, onClick, ...buttonRest } = rest as FilteredButtonProps
  const disabledOnLoading = $loading || disabled

  return (
    // eslint-disable-next-line smarthr/best-practice-for-button-element
    <button
      {...buttonRest}
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
