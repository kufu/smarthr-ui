import React, { ReactNode } from 'react'
import styled from 'styled-components'

type Props = {
  className?: string
  children: ReactNode
}

export const DropdownScrollArea: React.FC<Props> = ({ children, className = '' }) => (
  <Wrapper className={className}>{children}</Wrapper>
)

const Wrapper = styled.div`
  overflow-y: scroll;
  flex: 1;
`
