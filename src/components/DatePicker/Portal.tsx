import React, { FC, ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'
import styled, { css } from 'styled-components'

import { usePortal } from '../../hooks/usePortal'

type Props = {
  top: number
  left: number
  children: ReactNode
}

export const Portal: FC<Props> = ({ top, left, children }) => {
  const { portalRoot } = usePortal()
  useEffect(() => {
    document.body.appendChild(portalRoot)

    return () => {
      document.body.removeChild(portalRoot)
    }
  }, [portalRoot])

  return createPortal(
    <Container top={top} left={left}>
      {children}
    </Container>,
    portalRoot,
  )
}

const Container = styled.div<{ top: number; left: number }>(
  ({ top, left }) => css`
    position: absolute;
    top: ${top}px;
    left: ${left}px;
  `,
)
