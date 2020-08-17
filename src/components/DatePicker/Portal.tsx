import React, { FC, ReactNode, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import styled, { css } from 'styled-components'

type Props = {
  top: number
  left: number
  children: ReactNode
}

export const Portal: FC<Props> = ({ top, left, children }) => {
  const root = useRef(document.createElement('div')).current
  useEffect(() => {
    document.body.appendChild(root)

    return () => {
      document.body.removeChild(root)
    }
  }, [root])

  return createPortal(
    <Container top={top} left={left}>
      {children}
    </Container>,
    root,
  )
}

const Container = styled.div<{ top: number; left: number }>(
  ({ top, left }) => css`
    position: absolute;
    top: ${top}px;
    left: ${left}px;
  `,
)
