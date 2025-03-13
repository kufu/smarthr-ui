'use client'

import React, { type FC } from 'react'

import { DesktopHeader } from './components/desktop/DesktopHeader'
import { MobileHeader } from './components/mobile/MobileHeader'
import { LocaleContextProvider } from './hooks/useLocale'
import { mediaQuery, useMediaQuery } from './hooks/useMediaQuery'

import type { HeaderProps } from './types'

export const AppHeader: FC<HeaderProps> = ({ locale, children, ...props }) => {
  // NOTE: ヘッダーの出し分けは CSS によって行われているので、useMediaQuery による children の出し分けは本来不要ですが、
  //  wovn の言語切替カスタム UI の挿入対象となる DOM ("wovn-embedded-widget-anchor" クラスを持った div) が複数描画されていると、
  //  wovn のスクリプトの仕様上1つ目の DOM にしか UI が挿入されないため、やむを得ず children のみ React のレンダリングレベルでの出し分けをしています。
  const isDesktop = useMediaQuery(mediaQuery.desktop)
  const Header = isDesktop ? DesktopHeader : MobileHeader

  return (
    <LocaleContextProvider locale={locale}>
      <Header {...props}>{children}</Header>
    </LocaleContextProvider>
  )
}
