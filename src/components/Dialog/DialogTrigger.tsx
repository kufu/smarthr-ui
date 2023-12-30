import React, { PropsWithChildren, useContext } from 'react'

import { DialogContext } from './DialogWrapper'

export const DialogTrigger: React.FC<PropsWithChildren> = (props) => {
  const { onClickTrigger } = useContext(DialogContext)
  return (
    // eslint-disable-next-line smarthr/a11y-delegate-element-has-role-presentation
    <div {...props} onClick={onClickTrigger} aria-haspopup="dialog" className="shr-inline-block" />
  )
}
