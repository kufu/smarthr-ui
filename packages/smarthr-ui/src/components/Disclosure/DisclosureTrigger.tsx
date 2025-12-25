'use client'

import {
  type FC,
  type MouseEvent,
  type ReactElement,
  cloneElement,
  useCallback,
  useMemo,
} from 'react'

import { useDisclosure } from './useDisclosure'

type DisclosureTriggerNodeChildren = Omit<
  ReactElement,
  'onClick' | 'aria-expanded' | 'aria-controls'
>
type DisclosureTriggerFuncChildren = (args: { expanded: boolean }) => DisclosureTriggerNodeChildren

type DisclosureTriggerProps = {
  /** DisclosureContentのidと紐づける文字列 */
  targetId: string
  /** 開閉時のハンドラー */
  onClick?: (open: () => void, e: MouseEvent<HTMLButtonElement>) => void
  children: DisclosureTriggerNodeChildren | DisclosureTriggerFuncChildren
}

export const DisclosureTrigger: FC<DisclosureTriggerProps> = ({
  targetId,
  children,
  onClick,
  ...rest
}) => {
  const [expanded, setExpanded] = useDisclosure(targetId)

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
    [onClick, setExpanded],
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

  return actualTrigger
}
