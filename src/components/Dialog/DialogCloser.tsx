import React, { PropsWithChildren, useContext } from 'react'
import styled from 'styled-components'

import { DialogContentContext } from './DialogContent'

export const DialogCloser: React.FC<PropsWithChildren> = (props) => {
  const { onClickClose } = useContext(DialogContentContext)
  return <Wrapper {...props} onClick={onClickClose} />
}

const Wrapper = styled.div`
  display: inline-block;
`
