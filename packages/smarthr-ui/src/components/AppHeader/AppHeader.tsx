'use client'

import { useMemo, useState } from 'react'

import { useLatest } from '../../hooks/useLatest'

import { DesktopHeader } from './components/desktop/DesktopHeader'
import { MobileHeader } from './components/mobile/MobileHeader'
import { mediaQuery, useMediaQuery } from './hooks/useMediaQuery'

import type { HeaderProps, Launcher } from './types'
import type { FC } from 'react'

const EMPTY_FEATURES: Array<Launcher['feature']> = []

export const AppHeader: FC<HeaderProps> = ({
  children,
  desktopAdditionalContent,
  desktopNavigationAdditionalContent,
  mobileAdditionalContent,
  features,
  fetchFeatures,
  ...rest
}) => {
  // NOTE: ヘッダーの出し分けは CSS によって行われているので、useMediaQuery による children の出し分けは本来不要ですが、
  //  wovn の言語切替カスタム UI の挿入対象となる DOM ("wovn-embedded-widget-anchor" クラスを持った div) が複数描画されていると、
  //  wovn のスクリプトの仕様上1つ目の DOM にしか UI が挿入されないため、やむを得ず children のみ React のレンダリングレベルでの出し分けをしています。
  const isDesktop = useMediaQuery(mediaQuery.desktop)

  const [lazyFeatures, setLazyFeatures] = useState<{
    loading: boolean
    error: boolean
    data: Array<Launcher['feature']> | null
  }>({ loading: false, error: false, data: null })

  const latest = useLatest({ fetchFeatures, lazyFeatures })

  const functions = useMemo(
    () => ({
      handleOpenAppLauncher: () => {
        // HINT: Desktop・Mobileの両ヘッダーが常にマウントされているため、取得中・取得済みの場合はスキップし、
        //  どちらから開いても fetchFeatures の呼び出しが1回だけになるようにする
        if (latest.fetchFeatures && !latest.lazyFeatures.loading && !latest.lazyFeatures.data) {
          setLazyFeatures({ loading: true, error: false, data: null })

          // HINT: 失敗時は次回オープンで再試行できるようにする
          const handleError = () => setLazyFeatures({ loading: false, error: true, data: null })

          try {
            latest
              .fetchFeatures()
              .then((data) => setLazyFeatures({ loading: false, error: false, data }), handleError)
          } catch {
            // HINT: fetchFeatures が Promise を返す前に同期的に throw した場合も、loading のままにしない
            handleError()
          }
        }
      },
    }),
    [latest],
  )

  const resolvedFeatures = fetchFeatures
    ? (lazyFeatures.data ?? EMPTY_FEATURES)
    : (features ?? EMPTY_FEATURES)
  const isAppLauncherAvailable = !!fetchFeatures || resolvedFeatures.length > 0
  // HINT: Desktopは Dropdown の onOpen（requestAnimationFrame経由）で取得を開始するため、
  //  パネルが開いてから実際に取得が始まるまでに1フレームの猶予がある。
  //  fetchFeatures 指定時に未取得かつ未エラーの状態はすべて取得中として扱い、その間に「該当なし」が表示されるのを防ぐ
  const featuresLoading = !!fetchFeatures && lazyFeatures.data === null && !lazyFeatures.error

  // HINT: Desktop,Mobileの両ヘッダーは常にHTML上に存在し、cssでvisibleを切り替えることでSSR環境でのレイアウトシフトが発生しないようにしています
  // 表示切替は画面幅によって決まり、SSR環境では判定出来ないためです
  return (
    <>
      <DesktopHeader
        {...rest}
        desktopAdditionalContent={desktopAdditionalContent}
        desktopNavigationAdditionalContent={desktopNavigationAdditionalContent}
        features={resolvedFeatures}
        isAppLauncherAvailable={isAppLauncherAvailable}
        featuresLoading={featuresLoading}
        featuresError={lazyFeatures.error}
        handleOpenAppLauncher={functions.handleOpenAppLauncher}
      >
        {isDesktop ? children : undefined}
      </DesktopHeader>
      <MobileHeader
        {...rest}
        mobileAdditionalContent={mobileAdditionalContent}
        features={resolvedFeatures}
        isAppLauncherAvailable={isAppLauncherAvailable}
        featuresLoading={featuresLoading}
        featuresError={lazyFeatures.error}
        handleOpenAppLauncher={functions.handleOpenAppLauncher}
      >
        {isDesktop ? undefined : children}
      </MobileHeader>
    </>
  )
}
