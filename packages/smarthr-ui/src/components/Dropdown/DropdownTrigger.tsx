'use client'

import {
  type ComponentProps,
  type FC,
  type MouseEvent,
  type PropsWithChildren,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { useLayoutEffectRef } from '../../hooks/client/useLayoutEffectRef'
import { useMergeRefs } from '../../hooks/client/useMergeRefs'
import { tabbable } from '../../libs/tabbable'
import { Tooltip } from '../Tooltip'

import { DropdownContext } from './Dropdown'

type Props = PropsWithChildren<ComponentProps<'div'>> & {
  tooltip?: { message: ReactNode; show?: boolean }
}

const classNameGenerator = tv({
  base: 'smarthr-ui-Dropdown shr-inline-block',
})

export const DropdownTrigger: FC<Props> = ({ children, className, tooltip }) => {
  const { active, handleClickTrigger, contentId, triggerElementRef } = useContext(DropdownContext)
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  const handleDelegateClickCapture = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const button = (e.target as HTMLElement).closest('button')

      // 引き金となる要素が disabled な場合、処理を差し込む必要がないため、そのまま出力する
      if (button && !button.disabled && button.getAttribute('aria-disabled') !== 'true') {
        // HINT: Trigger要素自体にonClickが設定されている場合、先にDropdownを開いた状態で処理を行いたい
        // そのためcaptureで開く処理を実行する
        handleClickTrigger(button.getBoundingClientRect())
      }
    },
    [handleClickTrigger],
  )
  const layoutEffectRef = useLayoutEffectRef(
    (node: HTMLElement | null) => {
      if (node) {
        // apply ARIA to all focusable elements in trigger
        tabbable(node, { shouldIgnoreVisibility: true }).forEach((trigger) => {
          trigger.setAttribute('aria-expanded', active.toString())
          trigger.setAttribute('aria-controls', contentId)
        })
      }
    },
    [active, contentId],
  )

  const mergedRef = useMergeRefs(triggerElementRef, layoutEffectRef)

  return (
    <div ref={mergedRef} className={actualClassName} onClickCapture={handleDelegateClickCapture}>
      {tooltip && tooltip.show && tooltip.message ? (
        // eslint-disable-next-line smarthr/a11y-scroller-has-tabindex
        <Tooltip tabIndex={-1} triggerType="icon" message={tooltip.message}>
          {children}
        </Tooltip>
      ) : (
        children
      )}
    </div>
  )
}
