import React, { FC, ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styled, { css } from 'styled-components'
import { Theme, useTheme } from '../../hooks/useTheme'

import { usePortal } from '../../hooks/usePortal'
import { getPortalPosition } from './datePickerHelper'

type Props = {
  inputRect: DOMRect
  children: ReactNode
}

export const Portal: FC<Props> = ({ inputRect, children }) => {
  const themes = useTheme()
  const { portalRoot } = usePortal()

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  })
  const [isReady, setIsReady] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // wait for createPortal
    requestAnimationFrame(() => {
      if (!containerRef.current) {
        return
      }
      setPosition(getPortalPosition(inputRect, containerRef.current.offsetHeight))
      setIsReady(true)
    })
  }, [inputRect])

  return createPortal(
    <Container {...position} themes={themes} className={isReady ? 'ready' : ''} ref={containerRef}>
      {children}
    </Container>,
    portalRoot,
  )
}

const Container = styled.div<{ top: number; left: number; themes: Theme }>(
  ({ top, left, themes }) => css`
    position: absolute;
    top: ${top}px;
    left: ${left}px;
    z-index: ${themes.zIndex.OVERLAP};

    visibility: hidden;
    &.ready {
      visibility: visible;
    }
  `,
)
