'use client'

import { type FC, type ReactElement, useEffect, useMemo, useRef } from 'react'

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
  onClick?: (open: () => void, e: MouseEvent) => void
  children: DisclosureTriggerNodeChildren | DisclosureTriggerFuncChildren
}

export const DisclosureTrigger: FC<DisclosureTriggerProps> = ({ targetId, children, onClick }) => {
  const [expanded, setExpanded] = useDisclosure(targetId)
  const ref = useRef<HTMLSpanElement | null>(null)

  const actualOnClick = useMemo(() => {
    const toggleExpanded = () => {
      setExpanded((current) => !current)
    }

    if (onClick) {
      return (e: MouseEvent) => {
        onClick(toggleExpanded, e)
      }
    }

    return toggleExpanded
  }, [onClick, setExpanded])

  useEffect(() => {
    if (!ref.current) {
      return
    }

    const button = ref.current.querySelector('button')

    if (!button) {
      throw new Error('DisclosureTriggerのchildrenにbutton要素を設置してください')
    }

    button.setAttribute('aria-expanded', expanded.toString())
    button.setAttribute('aria-controls', targetId)
    button.addEventListener('click', actualOnClick)

    return () => {
      button.removeEventListener('click', actualOnClick)
    }
  }, [expanded, children, actualOnClick, targetId])

  // HINT: 念の為spanに対して外部からstyleを当てられるようにしておく。
  // Fragmentにrefが渡せるようになったタイミングでclassNameも不要になる
  // TODO: 将来的にspan -> Fragmentに変更する
  return (
    <span className="smarthr-ui-DisclosureTriggerWrapper" ref={ref}>
      {children instanceof Function ? children({ expanded }) : children}
    </span>
  )
}
