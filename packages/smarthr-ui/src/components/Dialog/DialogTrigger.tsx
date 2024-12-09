'use client'

import React, { PropsWithChildren, useContext } from 'react'

import { DialogContext } from './DialogWrapper'

export const DialogTrigger: React.FC<PropsWithChildren> = (props) => {
  const { onClickTrigger } = useContext(DialogContext)
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events,smarthr/a11y-delegate-element-has-role-presentation
    <div {...props} onClick={onClickTrigger} aria-haspopup="dialog" className="shr-inline-block" />
  )
}
