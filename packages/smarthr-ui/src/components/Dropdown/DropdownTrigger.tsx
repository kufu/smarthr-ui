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
      trigger.setAttribute('aria-expanded', String(active))
      trigger.setAttribute('aria-controls', contentId)
    })
  }, [triggerElementRef, active, contentId])

  let foundFirstElement = false

  return (
    <div ref={triggerElementRef} className={styles}>
      {React.Children.map(children, (child) => {
        if (foundFirstElement || !React.isValidElement(child)) {
          return child
        }

        foundFirstElement = true

        return React.cloneElement(child as ReactElement, {
          onClick: (e: MouseEvent) => {
            // 引き金となる要素が disabled な場合は発火させない
            if (includeDisabledTrigger(children)) {
              return
            }

            const { top, right, bottom, left } = e.currentTarget.getBoundingClientRect()
            onClickTrigger({ top, right, bottom, left })

            if (child.props.onClick) {
              child.props.onClick(e)
            }
          },
        })
      })}
    </div>
  )
}
