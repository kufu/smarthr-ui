import React, { FC, ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'
import styled, { css } from 'styled-components'
import { Theme, useTheme } from '../../hooks/useTheme'

import { usePortal } from '../../hooks/usePortal'

type Props = {
  top: number
  left: number
  children: ReactNode
}

export const Portal: FC<Props> = ({ top, left, children }) => {
  const themes = useTheme()
  const { portalRoot } = usePortal()
  useEffect(() => {
    document.body.appendChild(portalRoot)

    return () => {
      document.body.removeChild(portalRoot)
    }
  }, [portalRoot])

  return createPortal(
    <Container top={top} left={left} themes={themes}>
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
  `,
)
