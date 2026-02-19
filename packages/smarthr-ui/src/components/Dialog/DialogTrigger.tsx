'use client'

import { type FC, type PropsWithChildren, useContext } from 'react'

import { DialogContext } from './DialogWrapper'

export const DialogTrigger: FC<PropsWithChildren> = (props) => {
  const { onClickTrigger: onDelegateClick } = useContext(DialogContext)

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events
    <div {...props} onClick={onDelegateClick} aria-haspopup="dialog" className="shr-inline-block" />
  )
}
