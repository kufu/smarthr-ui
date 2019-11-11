import React, { useContext } from 'react'
import styled from 'styled-components'

import { DialogContentContext } from './DialogContent'

export const DialogCloser: React.FC = ({ children }) => {
  const { onClickClose } = useContext(DialogContentContext)
  return <Wrapper onClick={onClickClose}>{children}</Wrapper>
}

const Wrapper = styled.div`
  display: inline-block;
`
