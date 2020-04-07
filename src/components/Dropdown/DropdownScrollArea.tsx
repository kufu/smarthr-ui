import React from 'react'
import styled from 'styled-components'

export const DropdownScrollArea: React.FC<{}> = ({ children }) => (
  <Wrapper className="scroll">{children}</Wrapper>
)

const Wrapper = styled.div`
  overflow-y: scroll;
  flex: 1;
`
