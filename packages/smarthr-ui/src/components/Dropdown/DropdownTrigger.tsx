'use client'

import React, {
  ComponentProps,
  MouseEvent,
  PropsWithChildren,
  ReactElement,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { tabbable } from '../../libs/tabbable'
import { includeDisabledTrigger } from '../../libs/util'

import { DropdownContext } from './Dropdown'

type Props = PropsWithChildren<ComponentProps<'div'>>

const wrapper = tv({
  base: 'smarthr-ui-Dropdown shr-inline-block',
})

export const DropdownTrigger: React.FC<Props> = ({ children, className }) => {
  const { active, onClickTrigger, contentId, triggerElementRef } = useContext(DropdownContext)
  const styles = useMemo(() => wrapper({ className }), [className])

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
  }, [triggerElementRef, active, contentId])

  let foundFirstElement = false

  return (
    <div ref={triggerElementRef} className={styles}>
      {/* 引き金となる要素が disabled な場合、処理を差し込む必要がないため、そのまま出力する */}
      {includeDisabledTrigger(children)
        ? children
        : React.Children.map(children, (child) => {
            if (foundFirstElement || !React.isValidElement(child)) {
              return child
            }

            foundFirstElement = true

            return React.cloneElement(child as ReactElement, {
              onClick: (e: MouseEvent) => {
                onClickTrigger(e.currentTarget.getBoundingClientRect())

                child.props.onClick?.(e)
              },
            })
          })}
    </div>
  )
}
