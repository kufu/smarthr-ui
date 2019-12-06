import React, { FC, useContext, useCallback } from 'react'
import styled from 'styled-components'
import { Transition } from 'react-transition-group'
import { AccordionPanelItemContext } from './AccordionPanelItem'
import { AccordionPanelContext } from './AccordionPanel'
import { getIsInclude } from '../../libs/map'

type Props = {
  children: React.ReactNode
  className?: string
}

export const AccordionPanelContent: FC<Props> = ({ children, className = '' }) => {
  const { name } = useContext(AccordionPanelItemContext)
  const { expandedItems } = useContext(AccordionPanelContext)

  const wrapperRef = React.useRef<HTMLDivElement>(null)

  const handleEntering = useCallback(
    (node: HTMLElement) => {
      const wrapperHeight = wrapperRef.current ? wrapperRef.current.clientHeight : 0
      node.style.height = `${wrapperHeight}px`
    },
    [wrapperRef],
  )

  const handleEnterd = (node: HTMLElement) => {
    node.style.height = 'auto'
  }

  const handleExit = useCallback(
    (node: HTMLElement) => {
      const wrapperHeight = wrapperRef.current ? wrapperRef.current.clientHeight : 0
      node.style.height = `${wrapperHeight}px`
    },
    [wrapperRef],
  )

  const handleExiting = useCallback(
    (node: HTMLElement) => {
      const wrapperHeight = wrapperRef.current ? wrapperRef.current.clientHeight : 0
      node.style.height = `${wrapperHeight}px`
    },
    [wrapperRef],
  )

  const handleExited = (node: HTMLElement) => {
    node.style.height = '0px'
  }

  return (
    <Transition
      in={getIsInclude(expandedItems, name)}
      onEntering={handleEntering}
      onEntered={handleEnterd}
      onExit={handleExit}
      onExiting={handleExiting}
      onExited={handleExited}
      timeout={{
        enter: 300,
        exit: 0,
      }}
    >
      {status => (
        <CollapseContainer
          id={`${name}-content`}
          className={`${status} ${className}`}
          aria-labelledby={`${name}-trigger`}
          aria-hidden={!getIsInclude(expandedItems, name)}
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
  }
`
