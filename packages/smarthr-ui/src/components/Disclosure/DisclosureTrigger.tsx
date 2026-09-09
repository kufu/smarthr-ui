'use client'

import { type FC, type ReactElement, useCallback } from 'react'

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
  const [expanded, setExpanded, addDisclosureChangeListener] = useDisclosure(targetId)

  const latest = useLatest({ onClick, setExpanded, addDisclosureChangeListener })

  const callbackRef = useCallback(
    (node: HTMLElement | null) => {
      if (!node) {
        return
      }

      const removeDisclosureChangeListener = latest.addDisclosureChangeListener()

      let currentCleanup: (() => void) | undefined

      const setupButton = () => {
        currentCleanup?.()
        currentCleanup = undefined

        const button = node.querySelector('button')

        if (!button) {
          throw new Error('DisclosureTriggerのchildrenにbutton要素を設置してください')
        }

        button.setAttribute(
          'aria-expanded',
          (node.getAttribute('data-disclosure-expanded') === 'true').toString(),
        )
        button.setAttribute('aria-controls', node.getAttribute('data-disclosure-target-id') ?? '')

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
      observer.observe(node, {
        childList: true,
        subtree: true,
        // button要素の disabled / aria-disabled が動的に変化した場合も検知してリスナーを貼り直す
        attributes: true,
        attributeFilter: [
          'data-disclosure-expanded',
          'aria-disabled',
          'disabled',
          'data-disclosure-target-id',
        ],
      })

      return () => {
        currentCleanup?.()
        removeDisclosureChangeListener()
        observer.disconnect()
      }
    },
    [latest],
  )

  // HINT: 念の為spanに対して外部からstyleを当てられるようにしておく。
  // Fragmentにrefが渡せるようになったタイミングでclassNameも不要になる
  // TODO: 将来的にspan -> Fragmentに変更する
  return (
    <span
      ref={callbackRef}
      className="smarthr-ui-DisclosureTriggerWrapper shr-contents"
      data-disclosure-target-id={targetId}
      data-disclosure-expanded={expanded}
    >
      {children instanceof Function ? children({ expanded }) : children}
    </span>
  )
}
