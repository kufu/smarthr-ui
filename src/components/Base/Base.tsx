import * as React from 'react'
import styled, { css } from 'styled-components'

type Radius = 's' | 'm'

interface Props {
  radius?: Radius
  children?: React.ReactNode
  className?: string
}

const BaseComponent: React.FC<Props> = ({ radius = 'm', children, className = '' }) => {
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

interface WrapperProps {
  radius: string
}

const Wrapper = styled.div`
  ${({ radius }: WrapperProps) => {
    return css`
      border-radius: ${radius};
      box-shadow: rgba(51, 51, 51, 0.3) 1px 1px 4px 0;
      overflow: hidden;
    `
  }}
`

export const Base = BaseComponent
