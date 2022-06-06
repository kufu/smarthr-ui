import React, { ReactNode, VFC, createContext, useContext, useMemo } from 'react'

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
  // React バージョンによって使うフックを切り替えるためルールを抑止
  /* eslint-disable react-hooks/rules-of-hooks */
  if ('useId' in React) {
    // React v18 以降は React.useId を使う
    return defaultId || React.useId()
  }

  const context = useContext(IdContext)
  return useMemo(
    () => defaultId || `id-${context.prefix}-${++context.current}`,
    [defaultId, context],
  )
  /* eslint-enable */
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
