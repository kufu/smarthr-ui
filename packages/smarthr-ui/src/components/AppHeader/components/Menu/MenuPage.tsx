import { useLocalize } from '../../../../intl'
import { Scroller } from '../../../Scroller'
import { MobileLauncher } from '../Launcher'
import { MobileNavigation } from '../Navigation'
import { MobileReleaseNote } from '../ReleaseNote'

import { MenuSubHeading } from './MenuSubHeading'

import type { InternalHeaderProps, NavigationGroup } from '../../types'
import type { FC, PropsWithChildren, ReactNode } from 'react'

export type MenuPage =
  | { type: 'top' }
  | { type: 'launcher' }
  | { type: 'releaseNote' }
  | { type: 'navigationGroup'; navigation: NavigationGroup }

type HeadingProps = {
  page: MenuPage
  tenantSelector: ReactNode
  handleBackToTop: () => void
}

/** Drawer の閉じるボタンの左側に表示する内容。トップ以外のページでは戻るボタンと見出しを表示する */
export const MenuPageHeading: FC<HeadingProps> = ({ page, tenantSelector, handleBackToTop }) => {
  const translated = useLocalize({
    launcherListText: {
      id: 'smarthr-ui/AppHeader/Launcher/listText',
      defaultText: 'アプリ一覧',
    },
    latestReleaseNotes: {
      id: 'smarthr-ui/AppHeader/MobileHeader/latestReleaseNotes',
      defaultText: '最新のリリースノート',
    },
  })

  switch (page.type) {
    case 'launcher':
      return (
        <MenuSubHeading title={translated.launcherListText} handleClickBack={handleBackToTop} />
      )
    case 'releaseNote':
      return (
        <MenuSubHeading title={translated.latestReleaseNotes} handleClickBack={handleBackToTop} />
      )
    case 'navigationGroup':
      return <MenuSubHeading title={page.navigation.children} handleClickBack={handleBackToTop} />
  }

  return <div>{tenantSelector}</div>
}

type ContentProps = PropsWithChildren<
  Pick<
    InternalHeaderProps,
    'features' | 'isAppLauncherAvailable' | 'featuresLoading' | 'featuresError' | 'releaseNote'
  > & {
    page: MenuPage
    handleClose: () => void
    handleOpenNavigationGroup: (navigation: NavigationGroup) => void
  }
>

/** 表示中のページの本文。トップページでは children を表示する */
export const MenuPageContent: FC<ContentProps> = ({
  page,
  features,
  isAppLauncherAvailable,
  featuresLoading,
  featuresError,
  releaseNote,
  handleClose,
  handleOpenNavigationGroup,
  children,
}) =>
  page.type === 'launcher' && isAppLauncherAvailable ? (
    <MobileLauncher features={features} loading={featuresLoading} error={featuresError} />
  ) : (
    <ScrollArea>
      {page.type === 'releaseNote' ? (
        releaseNote && <MobileReleaseNote {...releaseNote} />
      ) : page.type === 'navigationGroup' ? (
        <MobileNavigation
          navigations={page.navigation.childNavigations}
          handleClickNavigation={handleClose}
          handleOpenNavigationGroup={handleOpenNavigationGroup}
        />
      ) : (
        children
      )}
    </ScrollArea>
  )

const ScrollArea: FC<PropsWithChildren> = ({ children }) => (
  <Scroller direction="vertical" className="shr-p-1">
    {children}
  </Scroller>
)
