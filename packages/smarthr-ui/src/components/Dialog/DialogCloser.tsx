'use client'

import React, { PropsWithChildren, useContext } from 'react'

import { DialogContentContext } from './DialogContent'

export const DialogCloser: React.FC<PropsWithChildren> = (props) => {
  const { onClickClose } = useContext(DialogContentContext)

  // eslint-disable-next-line smarthr/a11y-delegate-element-has-role-presentation
  return <div {...props} onClick={onClickClose} role="presentation" className="shr-inline-block" />
}
