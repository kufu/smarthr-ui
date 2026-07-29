'use client'

import { type FC, type PropsWithChildren, createContext, useMemo, useState } from 'react'

type DialogContextType = {
  handleDelegateClickTrigger: () => void
  handleDelegateClickClose: () => void
  active: boolean
}

const noop = () => undefined
export const DialogContext = createContext<DialogContextType>({
  handleDelegateClickTrigger: noop,
  handleDelegateClickClose: noop,
  active: false,
})

export const DialogWrapper: FC<PropsWithChildren> = (props) => {
  const [active, setActive] = useState(false)

  const functions = useMemo(
    () => ({
      handleDelegateClickTrigger: () => setActive(true),
      handleDelegateClickClose: () => setActive(false),
    }),
    [],
  )

  return (
    <DialogContext.Provider
      {...props}
      value={{
        ...functions,
        active,
      }}
    />
  )
}
