'use client'

import {
  type BaseSyntheticEvent,
  type ComponentProps,
  type FC,
  type PropsWithChildren,
  type FocusEvent as ReactFocusEvent,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  type TouchEvent as ReactTouchEvent,
  useId,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react'
import { createPortal } from 'react-dom'
import { tv } from 'tailwind-variants'

import { useLayoutEffectRef } from '../../../hooks/client/useLayoutEffectRef'
import { useLatest } from '../../../hooks/useLatest'

import { TooltipPortal } from './TooltipPortal'

const subscribeFullscreenChange = (callback: () => void) => {
  window.addEventListener('fullscreenchange', callback)

  return () => {
    window.removeEventListener('fullscreenchange', callback)
  }
}
const getPortalRoot = () => document.fullscreenElement ?? document.body
const getPortalRootOnSSR = () => null

const FOCUSABLE_SELECTOR =
  'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'

type BaseProps = PropsWithChildren<{
  /** ツールチップ内に表示するメッセージ */
  message: ReactNode
  /** ツールチップの種類。`label` の場合は children の要素に `aria-labelledby` を付与しアクセシブルネームとして機能する。`description`（デフォルト）の場合は `aria-describedby` を付与し補足説明として機能する */
  type?: 'label' | 'description'
  /** ツールチップを表示する対象のタイプ。アイコンの場合は `icon` を指定する */
  triggerType?: 'icon' | 'text'
  /** `true` のとき、ツールチップを表示する対象が省略されている場合のみツールチップ表示を有効にする */
  ellipsisOnly?: boolean
  /** ツールチップを表示する対象の tabIndex 値 */
  tabIndex?: number
  /** `type` が `description` の場合に `aria-describedby` を付与する対象。children が focusable な場合は常に children に付与されるため無視される */
  ariaDescribedbyTarget?: 'wrapper' | 'inner'
}>
type Props = BaseProps &
  Omit<ComponentProps<'span'>, keyof BaseProps | 'aria-describedby' | 'aria-labelledby' | 'role'>

const classNameGenerator = tv({
  base: [
    'smarthr-ui-Tooltip',
    'shr-relative',
    'shr-inline-block shr-max-w-full shr-align-bottom',
    'focus-visible:shr-focus-indicator--outer',
  ],
  variants: {
    isIcon: {
      true: 'shr-leading-[0]',
    },
  },
})

export const Tooltip: FC<Props> = ({
  message,
  children,
  type = 'description',
  triggerType,
  ellipsisOnly,
  tabIndex,
  ariaDescribedbyTarget = 'wrapper',
  className,
  onPointerEnter,
  onPointerLeave,
  onTouchStart,
  onTouchEnd,
  onFocus,
  onBlur,
  ...rest
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [rect, setRect] = useState<DOMRect | null>(null)
  const messageId = useId()
  const portalRoot = useSyncExternalStore(
    subscribeFullscreenChange,
    getPortalRoot,
    getPortalRootOnSSR,
  )

  const [isFocusableChild, setIsFocusableChild] = useState(false)
  const [actualTabIndex, setActualTabIndex] = useState<number | undefined>(tabIndex ?? 0)

  const isLabel = type === 'label'
  const isIcon = triggerType === 'icon'

  const actualClassName = useMemo(
    () => classNameGenerator({ isIcon, className }),
    [isIcon, className],
  )

  const latest = useLatest({
    onPointerEnter,
    onPointerLeave,
    onTouchStart,
    onTouchEnd,
    onFocus,
    onBlur,
    ellipsisOnly,
  })

  const functions = useMemo(() => {
    let node: HTMLElement | null = null

    const toShowAction = (e: BaseSyntheticEvent) => {
      // Tooltipのtriggerの他の要素(Dropwdown menu buttonで開いたmenu contentとか)に移動されたらtooltipを表示しない
      if (!node?.contains(e.target)) {
        return
      }

      if (latest.ellipsisOnly) {
        const outerWidth = parseInt(
          window.getComputedStyle(node.parentNode! as HTMLElement, null).width.match(/\d+/)![0],
          10,
        )

        if (outerWidth < 0 || outerWidth > node.clientWidth) {
          return
        }
      }

      setRect(node.getBoundingClientRect())
      setIsVisible(true)
    }
    const toCloseAction = () => {
      setRect(null)
      setIsVisible(false)
    }

    return {
      callbackRef: (n: HTMLElement | null) => {
        node = n
      },
      handleDelegatePointerEnter: (e: ReactPointerEvent<HTMLElement>) => {
        latest.onPointerEnter?.(e)
        toShowAction(e)
      },
      handleDelegateTouchStart: (e: ReactTouchEvent<HTMLElement>) => {
        latest.onTouchStart?.(e)
        toShowAction(e)
      },
      handleDelegateFocus: (e: ReactFocusEvent<HTMLElement>) => {
        latest.onFocus?.(e)
        toShowAction(e)
      },
      handleDelegatePointerLeave: (e: ReactPointerEvent<HTMLElement>) => {
        latest.onPointerLeave?.(e)
        toCloseAction()
      },
      handleDelegateTouchEnd: (e: ReactTouchEvent<HTMLElement>) => {
        latest.onTouchEnd?.(e)
        toCloseAction()
      },
      handleDelegateBlur: (e: ReactFocusEvent<HTMLElement>) => {
        latest.onBlur?.(e)
        toCloseAction()
      },
    }
  }, [latest])

  // TODO: childrenが変わった場合にfocusable判定が再実行されない。また、focusableから
  // 非focusableに変わった場合、以前設定したaria-labelledby/aria-describedbyが残り続ける。
  // どちらも今回のリファクタリング以前から存在する既存の課題であり、別途対応する
  const layoutEffectRef = useLayoutEffectRef(
    (node: HTMLElement | null) => {
      if (!node) {
        return
      }

      const childElement = node.firstElementChild as HTMLElement | undefined
      const focusable = !!childElement && childElement.matches(FOCUSABLE_SELECTOR)

      setIsFocusableChild(focusable)
      setActualTabIndex(tabIndex !== undefined ? tabIndex : focusable ? undefined : 0)

      // focusableな要素に直接aria属性を設定
      if (focusable) {
        childElement.setAttribute(isLabel ? 'aria-labelledby' : 'aria-describedby', messageId)
      }
    },
    [tabIndex, isLabel, messageId],
  )

  // TODO: ariaDescribedbyTarget==='inner'かつchildrenが非focusableの場合、
  // inner span(children直下のラッパー)側にaria-describedbyを設定するロジックが無く、
  // メッセージとの関連付けが失われる。今回のリファクタリング以前から存在する既存の課題であり、
  // 別途対応する
  const ariaDescribedby =
    isLabel || isFocusableChild || ariaDescribedbyTarget === 'inner' ? undefined : messageId

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <span
      {...rest}
      ref={functions.callbackRef}
      // HINT: presentation roleとaria-describedbyはARIA仕様上の衝突関係にあり、UAが
      // presentation roleを無視する規定になっている。この無視に依存せず、aria-describedbyを
      // 設定しない場合にのみpresentation roleを設定することで衝突自体を避ける
      role={ariaDescribedby ? undefined : 'presentation'}
      tabIndex={actualTabIndex}
      className={actualClassName}
      aria-describedby={ariaDescribedby}
      onPointerEnter={functions.handleDelegatePointerEnter}
      onTouchStart={functions.handleDelegateTouchStart}
      onFocus={functions.handleDelegateFocus}
      onPointerLeave={functions.handleDelegatePointerLeave}
      onTouchEnd={functions.handleDelegateTouchEnd}
      onBlur={functions.handleDelegateBlur}
    >
      {portalRoot &&
        createPortal(
          <TooltipPortal
            messageId={messageId}
            isVisible={isVisible}
            parentRect={rect}
            isIcon={isIcon}
            message={message}
          />,
          portalRoot,
        )}
      <span ref={layoutEffectRef} className="smarthr-ui-Tooltip-content shr-contents">
        {children}
      </span>
    </span>
  )
}
