'use client'

import {
  type ComponentProps,
  type FC,
  type PropsWithChildren,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

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
  const { active, onClickTrigger, contentId, triggerElementRef } = useContext(DropdownContext)
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  useEffect(() => {
    if (!triggerElementRef.current) {
      return
    }

    // apply ARIA to all focusable elements in trigger
    const triggers = tabbable(triggerElementRef.current, { shouldIgnoreVisibility: true })

    triggers.forEach((trigger) => {
      trigger.setAttribute('aria-expanded', active.toString())
      trigger.setAttribute('aria-controls', contentId)
    })
  }, [active, triggerElementRef, contentId])

  useEffect(() => {
    if (!triggerElementRef.current) {
      return
    }

    const button = triggerElementRef.current.querySelector<HTMLButtonElement>('button')

    // 引き金となる要素が disabled な場合、処理を差し込む必要がないため、そのまま出力する
    if (!button || button.disabled || button.getAttribute('aria-disabled') === 'true') {
      return
    }

    // HINT: Trigger要素自体にonClickが設定されている場合、先にDropdownを開いた状態で処理を行いたい
    // そのためcaptureで開く処理を実行する
    const callback = (e: MouseEvent) => {
      onClickTrigger((e.currentTarget! as HTMLButtonElement).getBoundingClientRect())
    }

    button.addEventListener('click', callback, CAPTURE_OPTION)

    return () => {
      button.removeEventListener('click', callback, CAPTURE_OPTION)
    }
  }, [children, onClickTrigger, triggerElementRef])

  return (
    <div ref={triggerElementRef} className={actualClassName}>
      <ConditionalWrapper
        shouldWrapContent={tooltip?.show}
        wrapper={({ children: currentChildren }) => (
          <Tooltip message={tooltip?.message} triggerType="icon" tabIndex={-1}>
            {currentChildren}
          </Tooltip>
        )}
      >
        {children}
      </ConditionalWrapper>
    </div>
  )
}
