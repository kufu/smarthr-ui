import React, { createContext } from 'react'

type PositionContextType = {
  top?: number
  bottom?: number
}

export const PositionContext = createContext<PositionContextType>({})

export const DialogPositionProvider: React.VFC<PositionContextType> = ({
  top,
  bottom,
  children,
}) => {
  return (
    <PositionContext.Provider
      value={{
        top,
        bottom,
      }}
    >
      {children}
    </PositionContext.Provider>
  )
}
