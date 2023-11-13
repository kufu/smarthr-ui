import React, { PropsWithChildren, useContext } from 'react'
import styled from 'styled-components'

import { DialogContext } from './DialogWrapper'

export const DialogTrigger: React.FC<PropsWithChildren> = (props) => {
  const { onClickTrigger } = useContext(DialogContext)
  return <Wrapper {...props} onClick={onClickTrigger} aria-haspopup="dialog" />
}

const Wrapper = styled.div`
  display: inline-block;
`
