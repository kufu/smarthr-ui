'use client'

import { type FC, type PropsWithChildren, useContext } from 'react'

import { DialogContext } from './DialogWrapper'

export const DialogTrigger: FC<PropsWithChildren> = (props) => {
  const { onClickTrigger: onDelegateClick } = useContext(DialogContext)

  return (
    <div {...props} onClick={onDelegateClick} aria-haspopup="dialog" className="shr-inline-block" />
  )
}
