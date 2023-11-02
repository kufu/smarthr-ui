import React, { FC, PropsWithChildren, ReactNode, useEffect, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import styled from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

type Props = PropsWithChildren<{
  isOpen: boolean
}>

const transitionClassName = 'shr-dialog-transition'

export const DialogOverlap: FC<Props> = ({ isOpen, children }) => {
  const theme = useTheme()
  const [childrenBuffer, setChildrenBuffer] = useState<ReactNode>(null)

  useEffect(() => {
    if (isOpen) {
      setChildrenBuffer(children)
    }
  }, [isOpen, children])

  return (
    <CSSTransition
      classNames={transitionClassName}
      in={isOpen}
      timeout={{
        appear: 500,
        enter: 300,
        exit: 300,
      }}
      appear
      unmountOnExit
    >
      <Wrapper themes={theme}>{isOpen ? children : childrenBuffer}</Wrapper>
    </CSSTransition>
  )
}

const Wrapper = styled.div<{ themes: Theme }>`
  position: absolute;
  z-index: ${({ themes }) => themes.zIndex.OVERLAP_BASE};

  &.${transitionClassName}-appear {
    opacity: 0;
  }
  &.${transitionClassName}-appear-active {
    transition: opacity 500ms;
    opacity: 1;
  }
  &.${transitionClassName}-enter {
    opacity: 0;
  }
  &.${transitionClassName}-enter-active {
    transition: opacity 300ms;
    opacity: 1;
  }
  &.${transitionClassName}-exit {
    opacity: 1;
  }
  &.${transitionClassName}-exit-active {
    transition: opacity 300ms;
    opacity: 0;
  }
`
