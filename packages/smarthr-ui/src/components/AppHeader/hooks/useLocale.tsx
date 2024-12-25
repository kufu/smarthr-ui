import React, { FC, ReactNode, createContext, useContext } from 'react'

import { HeaderProps } from '../types'

const LocaleContext = createContext<{ locale: HeaderProps['locale'] }>({
  locale: null,
})

type LocaleContextProviderProps = {
  locale: HeaderProps['locale']
  children: ReactNode
}

export const LocaleContextProvider: FC<LocaleContextProviderProps> = ({ locale, children }) => (
  <LocaleContext.Provider value={{ locale }}>{children}</LocaleContext.Provider>
)

export const useLocale = () => useContext(LocaleContext)
