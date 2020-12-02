import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'

import { DropdownContext } from './Dropdown'
import { tabbable } from './tabbable'

type Props = {
  children: React.ReactNode
  className?: string
}

export const DropdownTrigger: React.FC<Props> = ({ children, className = '' }) => {
  const { active, onClickTrigger, contentId, triggerElementRef } = useContext(DropdownContext)

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
    <Wrapper
      ref={triggerElementRef}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        onClickTrigger({
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          left: rect.left,
        })
      }}
      className={className}
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
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: inline-block;
`
