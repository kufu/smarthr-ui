import React, { FC, RefObject, useCallback, useContext, useRef } from 'react'
import styled from 'styled-components'
import { Transition } from 'react-transition-group'

import { getIsInclude } from '../../libs/map'
import { AccordionPanelItemContext } from './AccordionPanelItem'
import { AccordionPanelContext } from './AccordionPanel'

type Props = {
  children: React.ReactNode
  className?: string
}

const updateNodeHeight = (node: HTMLElement, wrapperRef: RefObject<HTMLDivElement>) => {
  const wrapperHeight = wrapperRef.current ? wrapperRef.current.clientHeight : 0
  node.style.height = `${wrapperHeight}px`
}

export const AccordionPanelContent: FC<Props> = ({ children, className = '' }) => {
  const { name } = useContext(AccordionPanelItemContext)
  const { expandedItems } = useContext(AccordionPanelContext)
  const isInclude = getIsInclude(expandedItems, name)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const handleEntering = useCallback(
    (node: HTMLElement) => {
      updateNodeHeight(node, wrapperRef)
    },
    [wrapperRef],
  )

  const handleEntered = (node: HTMLElement) => {
    node.style.height = 'auto'
  }

  const handleExit = useCallback(
    (node: HTMLElement) => {
      updateNodeHeight(node, wrapperRef)
    },
    [wrapperRef],
  )

  const handleExiting = useCallback(
    (node: HTMLElement) => {
      updateNodeHeight(node, wrapperRef)
    },
    [wrapperRef],
  )

  const handleExited = (node: HTMLElement) => {
    node.style.height = '0px'
  }

  return (
    <Transition
      in={isInclude}
      onEntering={handleEntering}
      onEntered={handleEntered}
      onExit={handleExit}
      onExiting={handleExiting}
      onExited={handleExited}
      timeout={{
        enter: 300,
        exit: 0,
      }}
    >
      {(status) => (
        <CollapseContainer
          id={`${name}-content`}
          className={`${status} ${className}`}
          aria-labelledby={`${name}-trigger`}
          aria-hidden={!isInclude}
        >
          <div ref={wrapperRef}>{children}</div>
        </CollapseContainer>
      )}
    </Transition>
  )
}

const CollapseContainer = styled.div`
  height: 0;
  overflow: hidden;
  transition: height 0.3s ease;

  &.entered {
    height: auto;
    overflow: visible;
  }
`
