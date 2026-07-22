'use client'

import { type FC, type ReactElement, useEffect, useRef } from 'react'

import { useLatest } from '../../hooks/useLatest'

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

  const latest = useLatest({ onClick, setExpanded })

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

      // Button は native disabled ではなく aria-disabled を使うため、
      // 無効時はリスナーを貼らず開閉しないようにする（DropdownTrigger と同じ）
      if (!button.disabled && button.getAttribute('aria-disabled') !== 'true') {
        const actualOnClick = (e: MouseEvent) => {
          const toggleExpanded = () => {
            latest.setExpanded((current) => !current)
          }

          if (latest.onClick) {
            latest.onClick(toggleExpanded, e)
          } else {
            toggleExpanded()
          }
        }

        button.addEventListener('click', actualOnClick)

        currentCleanup = () => {
          button.removeEventListener('click', actualOnClick)
        }
      }
    }

    setupButton()

    const observer = new MutationObserver(setupButton)
    observer.observe(wrapper, {
      childList: true,
      subtree: true,
      // button要素の disabled / aria-disabled が動的に変化した場合も検知してリスナーを貼り直す
      attributes: true,
      attributeFilter: ['disabled', 'aria-disabled'],
    })

    return () => {
      currentCleanup?.()
      observer.disconnect()
    }
  }, [expanded, targetId, latest])

  // HINT: 念の為spanに対して外部からstyleを当てられるようにしておく。
  // Fragmentにrefが渡せるようになったタイミングでclassNameも不要になる
  // TODO: 将来的にspan -> Fragmentに変更する
  return (
    <span className="smarthr-ui-DisclosureTriggerWrapper shr-contents" ref={ref}>
      {children instanceof Function ? children({ expanded }) : children}
    </span>
  )
}
