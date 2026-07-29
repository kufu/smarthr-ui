'use client'

import { type FC, type PropsWithChildren, createContext, useMemo, useState } from 'react'

type DialogContextType = {
  handleDelegateClickTrigger: () => void
  onClickClose: () => void
  active: boolean
}

const noop = () => undefined
export const DialogContext = createContext<DialogContextType>({
  handleDelegateClickTrigger: noop,
  onClickClose: noop,
  active: false,
})

export const DialogWrapper: FC<PropsWithChildren> = (props) => {
  const [active, setActive] = useState(false)

  const functions = useMemo(
    () => ({
      handleDelegateClickTrigger: () => setActive(true),
      handleClickClose: () => setActive(false),
    }),
    [],
  )

  return (
    <DialogContext.Provider
      {...props}
      value={{
        handleDelegateClickTrigger: functions.handleDelegateClickTrigger,
        onClickClose: functions.handleClickClose,
        active,
      }}
    />
  )
}
