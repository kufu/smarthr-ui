import React, { PropsWithChildren, useContext } from 'react'

import { DialogContentContext } from './DialogContent'

export const DialogCloser: React.FC<PropsWithChildren> = (props) => {
  const { onClickClose } = useContext(DialogContentContext)
  return <div {...props} onClick={onClickClose} className="shr-inline-block" />
}
