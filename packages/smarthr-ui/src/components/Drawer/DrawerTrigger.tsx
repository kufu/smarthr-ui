'use client'

import { type FC, type PropsWithChildren, useContext } from 'react'

import { DrawerContext } from './DrawerWrapper'

export const DrawerTrigger: FC<PropsWithChildren> = (props) => {
  const { handleDelegateClickTrigger, active } = useContext(DrawerContext)

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events
    <div
      {...props}
      className="shr-inline-block"
      aria-haspopup="dialog"
      aria-expanded={active}
      onClick={handleDelegateClickTrigger}
    />
  )
}
