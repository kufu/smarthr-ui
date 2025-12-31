import { type FC, useState } from 'react'

import { Header } from '../../../Header'

import { AppLauncherContext } from './AppLauncherContext'
import { Help } from './Help'
import { Menu } from './Menu'
import { NavigationContext } from './NavigationContext'
import { ReleaseNoteContext } from './ReleaseNoteContext'
import { TenantSelector } from './TenantSelector'
import { UserInfo } from './UserInfo'

import type { HeaderProps, NavigationGroup } from '../../types'

export const MobileHeader: FC<HeaderProps> = ({
  navigations,
  features,
  releaseNote,
  className = '',
  tenants,
  children,
  helpPageUrl,
  schoolUrl,
  userInfo,
  appName,
  currentTenantId,
  onTenantSelect,
  mobileAdditionalContent,
  locale,
  ...rest
}) => {
  const [isAppLauncherSelected, setIsAppLauncherSelected] = useState(false)
  const [isReleaseNoteSelected, setIsReleaseNoteSelected] = useState(false)
  const [selectedNavigationGroup, setSelectedNavigationGroup] = useState<NavigationGroup | null>(
    null,
  )

  // navigations の設定をメニューの解放条件とする
  const isMenuAvailable = navigations && navigations.length > 0

  return (
    <AppLauncherContext.Provider
      value={{
        features,
        isAppLauncherSelected,
        setIsAppLauncherSelected,
      }}
    >
      <NavigationContext.Provider
        value={{
          navigations: navigations ?? [],
          selectedNavigationGroup,
          setSelectedNavigationGroup,
        }}
      >
        <ReleaseNoteContext.Provider
          value={{
            releaseNote,
            isReleaseNoteSelected,
            setIsReleaseNoteSelected,
          }}
        >
          <Header
            {...rest}
            className={`${className} min-[752px]:!shr-hidden`}
            tenants={isMenuAvailable ? undefined : tenants}
          >
            {children}

            <Help helpPageUrl={helpPageUrl} schoolUrl={schoolUrl} />

            <UserInfo {...userInfo} locale={locale} />

            {isMenuAvailable && (
              <Menu
                appName={appName}
                tenantSelector={
                  <TenantSelector
                    tenants={tenants}
                    currentTenantId={currentTenantId}
                    onTenantSelect={onTenantSelect}
                  />
                }
                additionalContent={mobileAdditionalContent}
              />
            )}
          </Header>
        </ReleaseNoteContext.Provider>
      </NavigationContext.Provider>
    </AppLauncherContext.Provider>
  )
}
