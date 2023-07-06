import React, { HTMLAttributes, VFC, useCallback, useContext, useRef } from 'react'
import { Transition } from 'react-transition-group'
import styled from 'styled-components'

import { getIsInclude } from '../../libs/map'

import { AccordionPanelContext } from './AccordionPanel'
import { AccordionPanelItemContext } from './AccordionPanelItem'
import { useClassNames } from './useClassNames'

type Props = {
  /** パネル部分の内容 */
  children: React.ReactNode
  /** パネル部分のクラス名 */
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
          {...props}
          id={`${name}-content`}
          className={`${status} ${className} ${classNames.content}`}
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
  transition: height ${duration}ms ease;
  visibility: hidden;

  &.entered {
    height: auto;
    overflow: visible;
    visibility: visible;
  }
`
