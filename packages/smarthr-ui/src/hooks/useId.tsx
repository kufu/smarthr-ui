import React, { ReactNode, VFC, createContext, useContext, useMemo } from 'react'

type IdContextValue = {
  prefix: number
  current: number
}

const defaultContext: IdContextValue = {
  prefix: 0,
  current: 0,
}

const IdContext = createContext<IdContextValue>(defaultContext)

function useId_OLD() {
  const context = useContext(IdContext)
  return useMemo(() => `id-${context.prefix}-${++context.current}`, [context])
}

export const useId = (defaultId?: string): string => {
  if (defaultId) return defaultId

  // React v18 以降は React.useId を使う
  return ('useId' in React ? React.useId : useId_OLD)()
}

export const SequencePrefixIdProvider: VFC<{ children: ReactNode }> = ({ children }) => {
  const context = useContext(IdContext)
  // increment `prefix` and reset `current` to 0 on every Provider
  const value: IdContextValue = {
    prefix: context.prefix + 1,
    current: 0,
  }
  return <IdContext.Provider value={value}>{children}</IdContext.Provider>
}
