'use client'

import { type FC, type PropsWithChildren, useContext } from 'react'

import { DrawerContentContext } from './DrawerContentContext'

export const DrawerCloser: FC<PropsWithChildren> = (props) => {
  const { onClickClose } = useContext(DrawerContentContext)

  // eslint-disable-next-line smarthr/best-practice-for-interactive-element
  return <div {...props} role="presentation" className="shr-inline-block" onClick={onClickClose} />
}
