'use client'

import { type FC, type PropsWithChildren, createContext, useMemo, useState } from 'react'

type DialogContextType = {
  onClickTrigger: () => void
  onClickClose: () => void
  active: boolean
}

const noop = () => undefined
export const DialogContext = createContext<DialogContextType>({
  onClickTrigger: noop,
  onClickClose: noop,
  active: false,
})

export const DialogWrapper: FC<PropsWithChildren> = (props) => {
  const [active, setActive] = useState(false)

  const functions = useMemo(
    () => ({
      handleClickTrigger: () => setActive(true),
      handleClickClose: () => setActive(false),
    }),
    [],
  )

  return (
    <DialogContext.Provider
      {...props}
      value={{
        onClickTrigger: functions.handleClickTrigger,
        onClickClose: functions.handleClickClose,
        active,
      }}
    />
  )
}
