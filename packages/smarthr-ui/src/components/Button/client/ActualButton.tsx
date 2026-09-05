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

import { useCallbackRefCleanupForReact18 } from '../../../hooks/client/useCallbackRefCleanupForReact18'
import { useLatest } from '../../../hooks/useLatest'
import { Loader } from '../../Loader'

// HINT: prefix, suffixが存在せず、かつIcon,svg,img,Loaderのいずれかが単一でbodyに含まれるButtonかチェックしたい
// このSELECTORはbody内の対象を列挙する
// HINT: smarthr-ui-Icon-extendedはアイコン+α(例えば複数のアイコンをまとめて一つにしているなど)を表すclass
const ICON_SELECTOR = '.smarthr-ui-Icon, .smarthr-ui-Icon-extended, svg, img, .smarthr-ui-Loader'

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
  // HINT: squareは
  //  null: Buttonのレンダリング前
  //  boolean: レンダリング後
  const [square, setSquare] = useState<null | boolean>(null)

  // HINT: 後述のbutton向けのactualSuffixなどは$loadingの判定で置き換えられる可能性がある
  // あくまで利用者が設定したprefix, suffixがないかで判定する
  const onlyBody = !prefix && !suffix

  const nodeRef = useRef<HTMLElement | null>(null)
  const latest = useLatest({ onlyBody })

  const functions = useMemo(() => {
    const checkSquare = (target: HTMLElement) => {
      if (!latest.onlyBody) {
        setSquare(false)

        return
      }

      setSquare(target.children.length === 1 && target.children[0].matches(ICON_SELECTOR))
    }

    return {
      checkSquare,
      innerCallbackRef: (node: HTMLElement | null) => {
        nodeRef.current = node

        if (!node) return

        checkSquare(node)

        const observer = new MutationObserver(() => checkSquare(node))

        observer.observe(node, {
          childList: true,
        })

        return () => {
          observer.disconnect()
        }
      },
    }
  }, [latest])

  const innerRef = useCallbackRefCleanupForReact18(functions.innerCallbackRef)

  // HINT: onlyBodyはinner要素のmount/unmountを伴わずに変化しうるため、
  // callback refのmount時チェックだけでは追従できない。変化時に再チェックする
  useEffect(() => {
    if (nodeRef.current) {
      functions.checkSquare(nodeRef.current)
    }
  }, [onlyBody, functions])

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
        {prefix}
        <span ref={innerRef} className={classNames.inner}>
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
      {...commonAttrs}
      ref={buttonRef}
      aria-disabled={disabledOnLoading}
      onClick={disabledOnLoading ? EVENT_CANCELLER : onClick}
    >
      {actualPrefix}
      <span ref={innerRef} className={classNames.inner}>
        {actualChildren}
      </span>
      {actualSuffix}
    </button>
  )
}
