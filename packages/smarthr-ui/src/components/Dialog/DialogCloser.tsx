'use client'

import { type FC, type PropsWithChildren, useContext } from 'react'

import { DialogContentContext } from './DialogContent'

export const DialogCloser: FC<PropsWithChildren> = (props) => {
  const { handleDelegateClickClose } = useContext(DialogContentContext)

  return (
    <div
      {...props}
      onClick={handleDelegateClickClose}
      role="presentation"
      className="shr-inline-block"
    />
  )
}
