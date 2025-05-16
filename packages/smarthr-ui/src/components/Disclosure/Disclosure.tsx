import {
  type ComponentProps,
  type FC,
  type MouseEvent,
  type PropsWithChildren,
  type ReactElement,
  cloneElement,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react'

import { Stack } from '../Layout'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

import type { Button } from '../Button'

type AbstractContentProps = PropsWithChildren<{
  id: string
  open?: boolean
  visuallyHidden?: boolean
}>
type ContentProps = AbstractContentProps & Omit<ComponentProps<'div'>, keyof AbstractContentProps>

export const Disclosure: FC<
  ComponentProps<typeof Stack> &
    Pick<ContentProps, 'open' | 'visuallyHidden'> &
    PropsWithChildren<{
      trigger: Omit<ReactElement, 'onClick' | 'aria-expanded' | 'aria-controls' | 'variant'>
    }>
> = ({ trigger, children, open, visuallyHidden, ...rest }) => {
  const id = useId()

  return (
    <Stack {...rest}>
      <span>
        <DisclosureTrigger targetId={id}>{trigger}</DisclosureTrigger>
      </span>
      <DisclosureContent id={id} open={open} visuallyHidden={visuallyHidden}>
        {children}
      </DisclosureContent>
    </Stack>
  )
}

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

export const DisclosureTrigger: FC<
  Pick<ComponentProps<typeof Button>, 'variant'> & {
    targetId: string
    onClick?: (open: () => void, e: MouseEvent<HTMLButtonElement>) => void
    children: Omit<ReactElement, 'onClick' | 'aria-expanded' | 'aria-controls' | 'variant'>
  }
> = ({ targetId, children, onClick, variant, ...rest }) => {
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
  const actualTrigger = useMemo(
    () =>
      cloneElement(children as ReactElement, {
        onClick: actualOnClick,
        'aria-expanded': expanded.toString(),
        'aria-controls': targetId,
        variant,
        ...rest,
      }),
    [children, expanded, actualOnClick, targetId, variant, rest],
  )

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
  open,
  visuallyHidden,
  className,
  children,
  ...rest
}) => {
  const [expanded, setExpanded] = useState(open || false)

  useEffect(() => {
    document.dispatchEvent(
      new CustomEvent(CONTENT_TOGGLE_EVENT, {
        detail: { id, expanded: open || false },
      }),
    )
  }, [open, id])

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
      <div {...rest} id={id} className={className}>
        {children}
      </div>
    )
  }

  if (visuallyHidden) {
    return (
      <VisuallyHiddenText {...rest} id={id} className={className} as="div">
        {children}
      </VisuallyHiddenText>
    )
  }

  return null
}
