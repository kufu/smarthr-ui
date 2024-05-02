import React, { createContext } from 'react'

type PositionContextType = {
  top?: number
  bottom?: number
}

export const PositionContext = createContext<PositionContextType>({})

export const DialogPositionProvider: React.FC<
  PositionContextType & { children?: React.ReactNode }
> = ({ top, bottom, children }) => (
  <PositionContext.Provider
    value={{
      top,
      bottom,
    }}
  >
    {children}
  </PositionContext.Provider>
)
