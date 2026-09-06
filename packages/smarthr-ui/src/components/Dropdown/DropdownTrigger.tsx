'use client'

import {
  type ComponentProps,
  type FC,
  type PropsWithChildren,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { useMergeRefs } from '../../hooks/client/useMergeRefs'
import { useLatest } from '../../hooks/useLatest'
import { tabbable } from '../../libs/tabbable'
import { Tooltip } from '../Tooltip'

import { DropdownContext } from './Dropdown'

type ConditionalWrapperProps = {
  shouldWrapContent?: boolean
  wrapper: FC<PropsWithChildren>
}

const CAPTURE_OPTION = {
  capture: true,
}

/**
 * 条件付きでラッパをレンダリングする
 */
const ConditionalWrapper: FC<PropsWithChildren<ConditionalWrapperProps>> = ({
  shouldWrapContent,
  wrapper,
  children,
}) => (shouldWrapContent ? wrapper({ children }) : children)

type Props = PropsWithChildren<ComponentProps<'div'>> & {
  tooltip?: { message: ReactNode; show?: boolean }
}

const classNameGenerator = tv({
  base: 'smarthr-ui-Dropdown shr-inline-block',
})

export const DropdownTrigger: FC<Props> = ({ children, className, tooltip }) => {
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])
  const { active, handleClickTrigger, contentId, triggerElementRef, cleanupFrame } =
    useContext(DropdownContext)

  const latest = useLatest({ triggerElementRef, contentId, handleClickTrigger, cleanupFrame })

  const callbackRef = useCallback(
    (node: HTMLElement | null) => {
      if (!node) {
        return
      }

      let currentCleanup: (() => void) | undefined

      const setupButton = () => {
        // 既存のクリーンアップを実行
        currentCleanup?.()
        currentCleanup = undefined

        const button = node.querySelector<HTMLButtonElement>('button')

        // 引き金となる要素が disabled な場合、処理を差し込む必要がないため、そのまま出力する
        if (!button || button.disabled || button.getAttribute('aria-disabled') === 'true') {
          return
        }

        // HINT: Trigger要素自体にonClickが設定されている場合、先にDropdownを開いた状態で処理を行いたい
        // そのためcaptureで開く処理を実行する
        const callback = (e: MouseEvent) => {
          latest.handleClickTrigger((e.currentTarget! as HTMLButtonElement).getBoundingClientRect())
        }

        button.addEventListener('click', callback, CAPTURE_OPTION)

        currentCleanup = () => {
          button.removeEventListener('click', callback, CAPTURE_OPTION)
        }
      }

      setupButton()

      const observer = new MutationObserver(setupButton)

      observer.observe(node, {
        childList: true,
        subtree: true,
        // button要素の disabled / aria-disabled が動的に変化した場合も検知してリスナーを貼り直す
        attributes: true,
        attributeFilter: ['disabled', 'aria-disabled'],
      })

      return () => {
        currentCleanup?.()
        observer.disconnect()
        latest.cleanupFrame()
      }
    },
    [latest],
  )

  const mergedRef = useMergeRefs(triggerElementRef, callbackRef)

  // aria-expandedはactiveの変化と同期して更新する必要があるため、
  // MutationObserverベースのcallbackRef(非同期に発火しうる)とは分離する
  useEffect(() => {
    if (!latest.triggerElementRef.current) {
      return
    }

    const triggers = tabbable(latest.triggerElementRef.current, { shouldIgnoreVisibility: true })

    triggers.forEach((trigger) => {
      trigger.setAttribute('aria-expanded', active.toString())
      trigger.setAttribute('aria-controls', latest.contentId)
    })
  }, [active, latest])

  return (
    <div ref={mergedRef} className={actualClassName}>
      {/* eslint-disable-next-line smarthr/a11y-scroller-has-tabindex */}
      <ConditionalWrapper
        shouldWrapContent={tooltip?.show}
        wrapper={({ children: currentChildren }) =>
          tooltip?.message ? (
            // eslint-disable-next-line smarthr/a11y-scroller-has-tabindex
            <Tooltip tabIndex={-1} triggerType="icon" message={tooltip?.message}>
              {currentChildren}
            </Tooltip>
          ) : (
            currentChildren
          )
        }
      >
        {children}
      </ConditionalWrapper>
    </div>
  )
}
