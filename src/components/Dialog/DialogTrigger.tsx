import React, { useContext } from 'react'
import styled from 'styled-components'

import { DialogContext } from './DialogWrapper'

export const DialogTrigger: React.FC = ({ children }) => {
  const { onClickTrigger } = useContext(DialogContext)
  return <Wrapper onClick={onClickTrigger}>{children}</Wrapper>
}

const Wrapper = styled.div`
  display: inline-block;
`
