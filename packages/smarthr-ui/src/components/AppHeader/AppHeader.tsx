'use client'

import React, { type FC } from 'react'

import { DesktopHeader } from './components/desktop/DesktopHeader'
import { MobileHeader } from './components/mobile/MobileHeader'
import { LocaleContextProvider } from './hooks/useLocale'
import { mediaQuery, useMediaQuery } from './hooks/useMediaQuery'

import type { HeaderProps } from './types'

export const AppHeader: FC<HeaderProps> = ({ locale, children, ...props }) => {
  const isDesktop = useMediaQuery(mediaQuery.desktop)
  const Header = isDesktop ? DesktopHeader : MobileHeader

  return (
    <LocaleContextProvider locale={locale}>
      <Header {...props}>{children}</Header>
    </LocaleContextProvider>
  )
}
