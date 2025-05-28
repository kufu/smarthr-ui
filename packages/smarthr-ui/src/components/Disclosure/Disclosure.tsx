import {
  type ComponentProps,
  type FC,
  type MouseEvent,
  type PropsWithChildren,
  type ReactElement,
  cloneElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { VisuallyHiddenText } from '../VisuallyHiddenText'

type AbstractContentProps = PropsWithChildren<{
  /** DisclosureTriggerのtargetIdと紐づけるId */
  id: string
  /** 開閉状態。デフォルトは閉じている */
  isOpen?: boolean
  /** 閉じた状態でContentを要素として存在させるか。デフォルトでは要素は存在しない */
  visuallyHidden?: boolean
}>
type ContentProps = AbstractContentProps & Omit<ComponentProps<'div'>, keyof AbstractContentProps>

const TRIGGER_EVENT = 'smarthr-ui:disclosure-trigger-dispatch'
const CONTENT_TOGGLE_EVENT = 'smarthr-ui:disclosure-content-toggle-dispatch'

const toggleEffectListener = (
  event_key: string,
  callback: (e: Event & { detail: { id: string; expanded: boolean } }) => void,
) => {
  document.addEventListener(
    event_key,
    callback as Parameters<typeof document.addEventListener>['1'],
  )

  return () => {
    document.removeEventListener(
      event_key,
      callback as Parameters<typeof document.removeEventListener>['1'],
    )
  }
}

type TriggerChildrenType = Omit<ReactElement, 'onClick' | 'aria-expanded' | 'aria-controls'>

export const DisclosureTrigger: FC<{
  /** DisclosureContentのidと紐づける文字列 */
  targetId: string
  /** 開閉時のハンドラー */
  onClick?: (open: () => void, e: MouseEvent<HTMLButtonElement>) => void
  children: TriggerChildrenType | ((args: { expanded: boolean }) => TriggerChildrenType)
}> = ({ targetId, children, onClick, ...rest }) => {
  const [expanded, setExpanded] = useState(false)

  const actualOnClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const toggleExpanded = () => {
        setExpanded((current) => !current)
      }

      if (onClick) {
        return onClick(toggleExpanded, e)
      }

      toggleExpanded()
    },
    [onClick],
  )
  const actualTrigger = useMemo(() => {
    const actualChildren = children instanceof Function ? children({ expanded }) : children

    return cloneElement(actualChildren as ReactElement, {
      onClick: actualOnClick,
      'aria-expanded': expanded.toString(),
      'aria-controls': targetId,
      ...rest,
    })
  }, [expanded, children, actualOnClick, targetId, rest])

  useEffect(
    () =>
      toggleEffectListener(CONTENT_TOGGLE_EVENT, (e) => {
        if (targetId === e.detail.id) {
          setExpanded(e.detail.expanded)
        }
      }),
    [targetId],
  )

  useEffect(() => {
    // HINT: 基本的にtriggerはcontentより先にレンダリングされる
    // そのため、contentがレンダリングされたあとになることを期待して
    // requestAnimationFrameでイベント発火を遅延させる
    requestAnimationFrame(() => {
      document.dispatchEvent(
        new CustomEvent(TRIGGER_EVENT, {
          detail: { id: targetId, expanded },
        }),
      )
    })
  }, [expanded, targetId])

  return actualTrigger
}

export const DisclosureContent: FC<ContentProps> = ({
  id,
  isOpen,
  visuallyHidden,
  children,
  ...rest
}) => {
  const [expanded, setExpanded] = useState(isOpen || false)

  useEffect(() => {
    document.dispatchEvent(
      new CustomEvent(CONTENT_TOGGLE_EVENT, {
        detail: { id, expanded: isOpen || false },
      }),
    )
  }, [isOpen, id])

  useEffect(
    () =>
      toggleEffectListener(TRIGGER_EVENT, (e) => {
        if (id === e.detail.id) {
          setExpanded(e.detail.expanded)
        }
      }),
    [id],
  )

  if (expanded) {
    return (
      <div {...rest} id={id}>
        {children}
      </div>
    )
  }

  if (visuallyHidden) {
    return (
      <VisuallyHiddenText {...rest} id={id} as="div">
        {children}
      </VisuallyHiddenText>
    )
  }

  return null
}
