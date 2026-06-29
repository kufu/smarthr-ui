'use client'

import { type FC, type ReactElement, useCallback, useEffect, useRef } from 'react'

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

  const propsRef = useRef({ onClick, setExpanded })
  propsRef.current = { onClick, setExpanded }

  const actualOnClick = useCallback((e: MouseEvent) => {
    const toggleExpanded = () => {
      propsRef.current.setExpanded((current) => !current)
    }

    if (propsRef.current.onClick) {
      propsRef.current.onClick(toggleExpanded, e)
    } else {
      toggleExpanded()
    }
  }, [])

  useEffect(() => {
    const wrapper = ref.current
    if (!wrapper) {
      return
    }

    let currentCleanup: (() => void) | undefined

    const setupButton = () => {
      currentCleanup?.()
      currentCleanup = undefined

      const button = wrapper.querySelector('button')

      if (!button) {
        throw new Error('DisclosureTriggerのchildrenにbutton要素を設置してください')
      }

      button.setAttribute('aria-expanded', expanded.toString())
      button.setAttribute('aria-controls', targetId)
      button.addEventListener('click', actualOnClick)

      currentCleanup = () => {
        button.removeEventListener('click', actualOnClick)
      }
    }

    setupButton()

    const observer = new MutationObserver(setupButton)
    observer.observe(wrapper, {
      childList: true,
      subtree: true,
    })

    return () => {
      currentCleanup?.()
      observer.disconnect()
    }
  }, [expanded, targetId, actualOnClick])

  // HINT: 念の為spanに対して外部からstyleを当てられるようにしておく。
  // Fragmentにrefが渡せるようになったタイミングでclassNameも不要になる
  // TODO: 将来的にspan -> Fragmentに変更する
  return (
    <span className="smarthr-ui-DisclosureTriggerWrapper shr-contents" ref={ref}>
      {children instanceof Function ? children({ expanded }) : children}
    </span>
  )
}
