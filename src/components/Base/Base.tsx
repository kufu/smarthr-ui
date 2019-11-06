import React, { FC } from 'react'
import styled, { css } from 'styled-components'

type Props = {
  radius?: 's' | 'm'
  className?: string
}

export const Base: FC<Props> = ({ radius = 'm', className = '', children }) => {
  const radiusMap = {
    s: '6px',
    m: '8px',
  }

  return (
    <Wrapper radius={radiusMap[radius]} className={className}>
      {children}
    </Wrapper>
  )
}

const Wrapper = styled.div<{ radius: string }>`
  ${({ radius }) => {
    return css`
      overflow: hidden;
      border-radius: ${radius};
      box-shadow: rgba(51, 51, 51, 0.3) 1px 1px 4px 0;
      background-color: #fff;
    `
  }}
`
