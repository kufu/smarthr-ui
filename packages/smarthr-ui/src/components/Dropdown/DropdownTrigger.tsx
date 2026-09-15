'use client'

import {
  type ComponentProps,
  type FC,
  type PropsWithChildren,
  type ReactNode,
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
  const { active, handleDelegateClickTrigger, contentId, triggerElementRef } =
    useContext(DropdownContext)
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

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
    // HINT: Trigger要素自体にonClickが設定されている場合、先にDropdownを開いた状態で処理を行いたい
    // そのためcaptureで開く処理を実行する
    <div ref={mergedRef} className={actualClassName} onClickCapture={handleDelegateClickTrigger}>
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
