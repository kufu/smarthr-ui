import React, { useContext } from 'react'
import styled from 'styled-components'
import { Transition } from 'react-transition-group'
import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { AccordionContext } from './Accordion'

interface Props {
  children: React.ReactNode
}

const AccordionContentComponent: React.FC<Props & InjectedProps> = ({ children }) => {
  const { expanded } = useContext(AccordionContext)

  const wrapperRef = React.useRef<HTMLDivElement>(null)

  const handleEntering = (node: HTMLElement) => {
    const wrapperHeight = wrapperRef.current ? wrapperRef.current.clientHeight : 0
    node.style.height = `${wrapperHeight}px`
  }

  const handleEnterd = (node: HTMLElement) => {
    node.style.height = 'auto'
  }

  const handleExit = (node: HTMLElement) => {
    const wrapperHeight = wrapperRef.current ? wrapperRef.current.clientHeight : 0
    node.style.height = `${wrapperHeight}px`
  }
  const handleExiting = (node: HTMLElement) => {
    const wrapperHeight = wrapperRef.current ? wrapperRef.current.clientHeight : 0
    node.style.height = `${wrapperHeight}px`
  }
  const handleExited = (node: HTMLElement) => {
    node.style.height = `0px`
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
        <CollapseContainer className={status}>
          <div ref={wrapperRef}>{children}</div>
        </CollapseContainer>
      )}
    </Transition>
  )
}

AccordionContentComponent.displayName = 'AccordionContentComponent'

export const AccordionContent = withTheme(AccordionContentComponent)

const CollapseContainer = styled.div`
  height: 0;
  overflow: hidden;
  transition: height 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

  &.entered {
    height: auto;
  }
`
