import React, { PropsWithChildren, useContext } from 'react'

import { DialogContext } from './DialogWrapper'

export const DialogTrigger: React.FC<PropsWithChildren> = (props) => {
  const { onClickTrigger } = useContext(DialogContext)
  return (
    <div {...props} onClick={onClickTrigger} aria-haspopup="dialog" className="shr-inline-block" />
  )
}
