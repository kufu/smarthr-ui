import React, { ComponentProps, PropsWithChildren, useContext, useEffect, useMemo } from 'react'
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

  return (
    <div
      ref={triggerElementRef}
      onClick={(e) => {
        // 引き金となる要素が disabled な場合は発火させない
        if (includeDisabledTrigger(children)) {
          return
        }

        const rect = e.currentTarget.getBoundingClientRect()
        onClickTrigger({
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          left: rect.left,
        })
      }}
      className={styles}
    >
      {React.Children.map(children, (child: any) => {
        const props = child.props ? child.props : {}
        const { className: classNameProps = '' } = props

        switch (typeof child) {
          case 'string':
            return child

          case 'object':
            return React.cloneElement(child, {
              className: `${active ? 'active' : ''} ${classNameProps}`,
            })

          default:
            return null
        }
      })}
    </div>
  )
}
