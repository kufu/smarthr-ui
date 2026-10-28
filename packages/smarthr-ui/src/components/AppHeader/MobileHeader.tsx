import { Header } from '../Header'

import { MobileHelp } from './components/Help'
import { Menu } from './components/Menu'
import { MobileTenantSelector } from './components/TenantSelector'
import { MobileUserInfo } from './components/UserInfo'

import type { InternalHeaderProps } from './types'
import type { FC } from 'react'

export const MobileHeader: FC<InternalHeaderProps> = ({
  navigations,
  features,
  isAppLauncherAvailable,
  featuresLoading,
  featuresError,
  handleOpenAppLauncher,
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
  // navigations の設定をメニューの解放条件とする
  const isMenuAvailable = navigations && navigations.length > 0

  return (
    <Header
      {...rest}
      currentTenantId={isMenuAvailable ? undefined : currentTenantId}
      tenants={isMenuAvailable ? undefined : tenants}
      className={`${className} min-[752px]:!shr-hidden`}
      onTenantSelect={isMenuAvailable ? undefined : onTenantSelect}
    >
      {children}

      <MobileHelp helpPageUrl={helpPageUrl} schoolUrl={schoolUrl} />

      <MobileUserInfo {...userInfo} locale={locale} />

      {isMenuAvailable && (
        <Menu
          appName={appName}
          navigations={navigations}
          features={features}
          isAppLauncherAvailable={isAppLauncherAvailable}
          featuresLoading={featuresLoading}
          featuresError={featuresError}
          releaseNote={releaseNote}
          tenantSelector={
            <MobileTenantSelector
              currentTenantId={currentTenantId}
              tenants={tenants}
              onTenantSelect={onTenantSelect}
            />
          }
          additionalContent={mobileAdditionalContent}
          handleOpenAppLauncher={handleOpenAppLauncher}
        />
      )}
    </Header>
  )
}
