import React, { FC, HTMLAttributes, RefObject, useCallback, useContext, useRef } from 'react'
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

const updateNodeHeight = (node: HTMLElement, wrapperRef: RefObject<HTMLDivElement>) => {
  const wrapperHeight = wrapperRef.current ? wrapperRef.current.clientHeight : 0
  node.style.height = `${wrapperHeight}px`
}

export const AccordionPanelContent: FC<Props & ElementProps> = ({
  children,
  className = '',
  ...props
}) => {
  const { name } = useContext(AccordionPanelItemContext)
  const { expandedItems } = useContext(AccordionPanelContext)
  const isInclude = getIsInclude(expandedItems, name)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const classNames = useClassNames()

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

const CollapseContainer = styled.div`
  height: 0;
  overflow: hidden;
  transition: height 0.3s ease;

  &.entered {
    height: auto;
    overflow: visible;
  }
`
