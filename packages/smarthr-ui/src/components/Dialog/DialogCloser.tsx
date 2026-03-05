'use client'

import { type FC, type PropsWithChildren, useContext } from 'react'

import { DialogContentContext } from './DialogContent'

export const DialogCloser: FC<PropsWithChildren> = (props) => {
  const { onClickClose } = useContext(DialogContentContext)

  // eslint-disable-next-line smarthr/best-practice-for-interactive-element
  return <div {...props} onClick={onClickClose} role="presentation" className="shr-inline-block" />
}
