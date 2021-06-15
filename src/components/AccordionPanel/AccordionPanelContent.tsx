import React, { HTMLAttributes, VFC, useCallback, useContext, useRef } from 'react'
import styled from 'styled-components'
import { Transition } from 'react-transition-group'

import { getIsInclude } from '../../libs/map'
import { AccordionPanelItemContext } from './AccordionPanelItem'
import { AccordionPanelContext } from './AccordionPanel'
import { useClassNames } from './useClassNames'

type Props = {
  children: React.ReactNode
  className?: string
}
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

const duration = 200

export const AccordionPanelContent: VFC<Props & ElementProps> = ({
  children,
  className = '',
  ...props
}) => {
  const { name } = useContext(AccordionPanelItemContext)
  const { expandedItems } = useContext(AccordionPanelContext)
  const isInclude = getIsInclude(expandedItems, name)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const classNames = useClassNames()

  const recalculateHeight = useCallback(
    (node: HTMLElement) => {
      const wrapperHeight = wrapperRef.current ? wrapperRef.current.clientHeight : 0
      node.style.height = `${wrapperHeight}px`
    },
    [wrapperRef],
  )

  const handleEntered = (node: HTMLElement) => {
    node.style.height = 'auto'
    node.style.visibility = 'visible'
  }

  const handleExited = (node: HTMLElement) => {
    node.style.height = '0px'
    node.style.visibility = 'hidden'
  }

  return (
    <Transition
      in={isInclude}
      onEntering={recalculateHeight}
      onEntered={handleEntered}
      onExit={recalculateHeight}
      onExiting={recalculateHeight}
      onExited={handleExited}
      timeout={duration}
    >
      {(status) => (
        <CollapseContainer
          id={`${name}-content`}
          className={`${status} ${className} ${classNames.content}`}
          aria-labelledby={`${name}-trigger`}
          aria-hidden={!isInclude}
          {...props}
        >
          <div ref={wrapperRef}>{children}</div>
        </CollapseContainer>
      )}
    </Transition>
  )
}

const CollapseContainer = styled.section`
  height: 0;
  overflow: hidden;
  transition: height ${duration}ms ease;
  visibility: hidden;

  &.entered {
    height: auto;
    overflow: visible;
    visibility: visible;
  }
`
