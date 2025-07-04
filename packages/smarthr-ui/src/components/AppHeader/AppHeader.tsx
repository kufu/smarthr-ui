'use client'

import { IntlProvider } from '../../intl'

import { DesktopHeader } from './components/desktop/DesktopHeader'
import { MobileHeader } from './components/mobile/MobileHeader'
import { LocaleContextProvider } from './hooks/useLocale'
import { mediaQuery, useMediaQuery } from './hooks/useMediaQuery'

import type { HeaderProps } from './types'
import type { FC } from 'react'

export const AppHeader: FC<HeaderProps> = ({ locale, children, ...props }) => {
  // NOTE: ヘッダーの出し分けは CSS によって行われているので、useMediaQuery による children の出し分けは本来不要ですが、
  //  wovn の言語切替カスタム UI の挿入対象となる DOM ("wovn-embedded-widget-anchor" クラスを持った div) が複数描画されていると、
  //  wovn のスクリプトの仕様上1つ目の DOM にしか UI が挿入されないため、やむを得ず children のみ React のレンダリングレベルでの出し分けをしています。
  const isDesktop = useMediaQuery(mediaQuery.desktop)

  // HINT: Desktop,Mobileの両ヘッダーは常にHTML上に存在し、cssでvisibleを切り替えることでSSR環境でのレイアウトシフトが発生しないようにしています
  // 表示切替は画面幅によって決まり、SSR環境では判定出来ないためです
  return (
    <IntlProvider locale={locale?.selectedLocale ?? 'ja'}>
      <LocaleContextProvider locale={locale}>
        <DesktopHeader {...props}>{isDesktop ? children : undefined}</DesktopHeader>
        <MobileHeader {...props}>{isDesktop ? undefined : children}</MobileHeader>
      </LocaleContextProvider>
    </IntlProvider>
  )
}
