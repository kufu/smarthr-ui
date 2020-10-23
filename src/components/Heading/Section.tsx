import React, { FC, HTMLAttributes, useContext } from 'react'

import { LevelContext } from './H'

type Props = HTMLAttributes<HTMLElement>

export const Section: FC<Props> = ({ children, ...props }) => {
  const level = useContext(LevelContext)
  return (
    <LevelContext.Provider value={level + 1}>
      <section {...props}>{children}</section>
    </LevelContext.Provider>
  )
}
