import React, { useContext, useCallback } from 'react'
import styled from 'styled-components'
import { Transition } from 'react-transition-group'
import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { AccordionContext } from './Accordion'

type Props = {
  children: React.ReactNode
  className?: string
}

const AccordionContentComponent: React.FC<Props & InjectedProps> = ({
  children,
  className = '',
}) => {
  const { expanded, name } = useContext(AccordionContext)
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
      in={expanded}
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
          aria-hidden={!expanded}
        >
          <div ref={wrapperRef}>{children}</div>
        </CollapseContainer>
      )}
    </Transition>
  )
}

export const AccordionContent = withTheme(AccordionContentComponent)

const CollapseContainer = styled.div`
  height: 0;
  overflow: hidden;
  transition: height 0.3s;

  &.entered {
    height: auto;
  }
`
