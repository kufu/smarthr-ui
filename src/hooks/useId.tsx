import React, { FC, ReactNode, createContext, useContext, useMemo } from 'react'

interface IdContextValue {
  prefix: number
  current: number
}

const defaultContext: IdContextValue = {
  prefix: 0,
  current: 0,
}

const IdContext = createContext<IdContextValue>(defaultContext)

export function useId(defaultId?: string) {
  const context = useContext(IdContext)
  return useMemo(() => defaultId || `id-${context.prefix}-${++context.current}`, [
    defaultId,
    context,
  ])
}

export const SequencePrefixIdProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const context = useContext(IdContext)
  // increment `prefix` and reset `current` to 0 on every Provider
  const value: IdContextValue = {
    prefix: context.prefix + 1,
    current: 0,
  }
  return <IdContext.Provider value={value}>{children}</IdContext.Provider>
}
