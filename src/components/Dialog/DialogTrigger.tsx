import React, { useContext } from 'react'
import styled from 'styled-components'

import { DialogContext } from './DialogWrapper'

export const DialogTrigger: React.VFC<{ children?: React.ReactNode }> = ({ children }) => {
  const { onClickTrigger } = useContext(DialogContext)
  return (
    <Wrapper onClick={onClickTrigger} aria-haspopup="dialog">
      {children}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: inline-block;
`
