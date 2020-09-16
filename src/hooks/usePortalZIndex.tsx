import React, { FC, ReactNode, createContext, useContext } from 'react'

interface PortalZIndexValue {
  zIndex: number
}

const defaultContext: PortalZIndexValue = {
  zIndex: 10000,
}

const PortalZIndexContext = createContext<PortalZIndexValue>(defaultContext)

export function usePortalZIndex() {
  const context = useContext(PortalZIndexContext)
  return context.zIndex
}
export const PortalZIndexProvider: FC<{ increment?: number; children: ReactNode }> = ({
  increment = 0,
  children,
}) => {
  const zIndex = usePortalZIndex()
  const value: PortalZIndexValue = {
    zIndex: zIndex + increment,
  }
  return <PortalZIndexContext.Provider value={value}>{children}</PortalZIndexContext.Provider>
}
