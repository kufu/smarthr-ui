import React, {
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import styled, { css } from 'styled-components'
import { Theme, useTheme } from '../../hooks/useTheme'

import { usePortal } from '../../hooks/usePortal'
import { getPortalPosition } from './datePickerHelper'
import { useClassNames } from './useClassNames'

type Props = {
  inputRect: DOMRect
  children: ReactNode
}

export const Portal = forwardRef<HTMLDivElement, Props>(({ inputRect, children }, ref) => {
  const themes = useTheme()
  const { createPortal, isReady } = usePortal()

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  })
  const containerRef = useRef<HTMLDivElement>(null)
  useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(ref, () => containerRef.current)

  useLayoutEffect(() => {
    if (!containerRef.current || !isReady) {
      return
    }
    setPosition(getPortalPosition(inputRect, containerRef.current.offsetHeight))
  }, [inputRect, isReady])

  const classNames = useClassNames()

  return createPortal(
    <Container
      {...position}
      themes={themes}
      className={`${isReady ? 'ready' : ''} ${classNames.calendarContainer}`}
      ref={containerRef}
    >
      {children}
    </Container>,
  )
})

const Container = styled.div<{ top: number; left: number; themes: Theme }>(
  ({ top, left, themes }) => css`
    position: absolute;
    top: ${top}px;
    left: ${left}px;
    z-index: ${themes.zIndex.OVERLAP};
    line-height: 1;

    visibility: hidden;
    &.ready {
      visibility: visible;
    }
  `,
)
