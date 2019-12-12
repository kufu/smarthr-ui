import React, { ReactNode, forwardRef } from 'react'
import styled, { css } from 'styled-components'

type Props = {
  children: ReactNode
  radius?: 's' | 'm'
  className?: string
}

export const DialogBase = forwardRef<HTMLDivElement, Props>(({ radius = 'm', ...props }, ref) => {
  const radiusMap = {
    s: '6px',
    m: '8px',
  }
  return <Wrapper radius={radiusMap[radius]} ref={ref} {...props} />
})

const Wrapper = styled.div<{ radius: string }>`
  ${({ radius }) => {
    return css`
      border-radius: ${radius};
      box-shadow: rgba(51, 51, 51, 0.3) 0px 4px 10px 0;
      background-color: #fff;
    `
  }}
`
