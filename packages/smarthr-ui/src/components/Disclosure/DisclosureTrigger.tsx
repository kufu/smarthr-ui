'use client'

import { type FC, type MouseEvent, type ReactElement, cloneElement, useMemo } from 'react'

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
  onClick?: (e: MouseEvent<HTMLButtonElement>, open: () => void) => void
  children: DisclosureTriggerNodeChildren | DisclosureTriggerFuncChildren
}

export const DisclosureTrigger: FC<DisclosureTriggerProps> = ({ targetId, children, onClick }) => {
  const [expanded, setExpanded] = useDisclosure(targetId)

  const actualOnClick = useMemo(() => {
    const toggleExpanded = () => {
      setExpanded((current) => !current)
    }

    if (onClick) {
      return (e: MouseEvent<HTMLButtonElement>) => {
        onClick(e, toggleExpanded)
      }
    }

    return toggleExpanded
  }, [onClick, setExpanded])

  const actualTrigger = useMemo(() => {
    const actualChildren = children instanceof Function ? children({ expanded }) : children

    return cloneElement(actualChildren as ReactElement, {
      ...rest,
      onClick: actualOnClick,
      'aria-expanded': expanded.toString(),
      'aria-controls': targetId,
    })
  }, [expanded, children, actualOnClick, targetId])

  return actualTrigger
}
