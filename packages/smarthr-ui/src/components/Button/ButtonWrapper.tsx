'use client'

import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ElementType,
  type FC,
  type ForwardedRef,
  type MouseEvent,
  type PropsWithChildren,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { Loader } from '../Loader'

import { classNameGenerator } from './style'

import type { Variant } from './types'

// HINT: prefix, suffixが存在せず、かつIcon,svg,img,Loaderのいずれかが単一でbodyに含まれるButtonかチェックしたい
// このSELECTORはbody内の対象を列挙する
// HINT: smarthr-ui-Icon-extendedはアイコン+α(例えば複数のアイコンをまとめて一つにしているなど)を表すclass
const ICON_SELECTOR = '.smarthr-ui-Icon, .smarthr-ui-Icon-extended, svg, img, .smarthr-ui-Loader'

const EVENT_CANCELLER = (e: MouseEvent<HTMLButtonElement>) => {
  e.preventDefault()
  e.stopPropagation()
}

type BaseProps = PropsWithChildren<{
  size: 'M' | 'S'
  wide: boolean
  variant: Variant
  $loading?: boolean
  className: string
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
type FilteredProps =
  'size' | 'wide' | 'variant' | 'className' | 'prefix' | 'suffix' | 'children' | 'isAnchor'
type FilteredButtonProps = Omit<ButtonProps, FilteredProps>
type FilteredAnchorProps = Omit<AnchorProps, FilteredProps>

export const ButtonWrapper: FC<Props> = ({
  size,
  wide = false,
  variant,
  $loading,
  className,
  prefix,
  suffix,
  children,
  isAnchor,
  ...rest
}) => {
  const innerRef = useRef<HTMLElement>(null)
  // HINT: squareは
  //  null: Buttonのレンダリング前
  //  boolean: レンダリング後
  const [square, setSquare] = useState<null | boolean>(null)

  const classNames = useMemo(() => {
    const { button, anchor, loader, inner } = classNameGenerator()

    const wrapper = isAnchor ? anchor : button

    return {
      wrapper: wrapper({ variant, size, wide, className }),
      loader: loader({ variant }),
      inner: inner({ size }),
    }
  }, [size, variant, wide, className, isAnchor])

  let actualPrefix = prefix
  let actualSuffix = suffix
  let actualChildren = children

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

  // HINT: actualSuffixなどは$loadingの判定で置き換えられる可能性がある
  // あくまで利用者が設定したprefix, suffixがないかで判定する
  const onlyBody = !prefix && !suffix

  useEffect(() => {
    if (!onlyBody) {
      setSquare(false)

      return
    }

    const target = innerRef.current

    if (!target) return

    const checkSquare = () => {
      setSquare(target.children.length === 1 && target.children[0].matches(ICON_SELECTOR))
    }

    checkSquare()

    const observer = new MutationObserver(checkSquare)

    observer.observe(target, {
      childList: true,
    })

    return () => {
      observer.disconnect()
    }
  }, [onlyBody])

  const inner = (
    <span ref={innerRef} className={classNames.inner}>
      {actualChildren}
    </span>
  )
  const commonAttrs = {
    className: classNames.wrapper,
    'data-loading': $loading || undefined,
    'data-square': square || undefined,
  }

  if (isAnchor) {
    // eslint-disable-next-line smarthr/best-practice-for-rest-parameters
    const { anchorRef, elementAs, ...anchorRest } = rest as FilteredAnchorProps
    const Component = elementAs || 'a'

    return (
      <Component {...anchorRest} {...commonAttrs} ref={anchorRef}>
        {actualPrefix}
        {inner}
        {actualSuffix}
      </Component>
    )
  }

  // eslint-disable-next-line smarthr/best-practice-for-rest-parameters
  const { buttonRef, disabled, onClick, ...buttonRest } = rest as FilteredButtonProps
  const disabledOnLoading = $loading || disabled

  return (
    // eslint-disable-next-line smarthr/best-practice-for-button-element
    <button
      {...buttonRest}
      {...commonAttrs}
      ref={buttonRef}
      aria-disabled={disabledOnLoading}
      onClick={disabledOnLoading ? EVENT_CANCELLER : onClick}
    >
      {actualPrefix}
      {inner}
      {actualSuffix}
    </button>
  )
}
