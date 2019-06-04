import * as React from 'react'
import styled, { css } from 'styled-components'

type Radius = 's' | 'm'

interface Props {
  radius?: Radius
  children?: React.ReactNode
}

const BaseComponent: React.FC<Props> = ({ radius = 'm', children }) => {
  const radiusMap = {
    s: '6px',
    m: '8px',
  }

  return <Wrapper radius={radiusMap[radius]}>{children}</Wrapper>
}

interface WrapperProps {
  radius: string
}

const Wrapper = styled.div`
  ${({ radius }: WrapperProps) => {
    return css`
      border-radius: ${radius};
      box-shadow: rgba(51, 51, 51, 0.3) 1px 1px 4px 0;
    `
  }}
`

export const Base = BaseComponent
