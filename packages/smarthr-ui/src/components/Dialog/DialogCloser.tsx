'use client'

import { type FC, type PropsWithChildren, useContext } from 'react'

import { DialogContext } from './DialogWrapper'

export const DialogCloser: FC<PropsWithChildren> = (props) => {
  const { handleDelegateClickClose } = useContext(DialogContext)

  return (
    <div
      {...props}
      role="presentation"
      className="shr-inline-block"
      onClick={handleDelegateClickClose}
    />
  )
}
