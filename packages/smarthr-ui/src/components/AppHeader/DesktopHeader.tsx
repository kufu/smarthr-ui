import { type FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Header } from '../Header'
import { Cluster } from '../Layout'

import { DesktopHelp } from './components/Help'
import { DesktopLauncher } from './components/Launcher'
import { DesktopLocale } from './components/Locale'
import { DesktopNavigation } from './components/Navigation'
import { DesktopUserInfo } from './components/UserInfo'

import type { InternalHeaderProps } from './types'

const classNameGenerator = tv({
  base: 'max-[751px]:!shr-hidden',
})

export const DesktopHeader: FC<InternalHeaderProps> = ({
  enableNew,
  className = '',
  appName,
  tenants,
  currentTenantId,
  schoolUrl,
  helpPageUrl,
  children,
  userInfo,
  desktopAdditionalContent,
  navigations,
  desktopNavigationAdditionalContent,
  releaseNote,
  features,
  isAppLauncherAvailable,
  featuresLoading,
  featuresError,
  handleOpenAppLauncher,
  locale,
  ...rest
}) => {
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  return (
    <>
      <Header
        {...rest}
        currentTenantId={currentTenantId}
        enableNew={enableNew}
        featureName={appName}
        tenants={tenants}
        className={actualClassName}
      >
        <Cluster align="center" className="shr--me-0.25">
          {!enableNew && isAppLauncherAvailable && (
            <DesktopLauncher
              features={features}
              loading={featuresLoading}
              error={featuresError}
              enableNew={enableNew}
              handleOpen={handleOpenAppLauncher}
            />
          )}

          <DesktopHelp enableNew={enableNew} helpPageUrl={helpPageUrl} schoolUrl={schoolUrl} />

          {locale && <DesktopLocale locale={locale} enableNew={enableNew} />}

          {children}

          {userInfo && (
            <DesktopUserInfo
              {...userInfo}
              currentTenantId={currentTenantId}
              tenants={tenants}
              desktopAdditionalContent={desktopAdditionalContent}
              enableNew={enableNew}
            />
          )}
        </Cluster>
      </Header>

      {navigations && (
        <DesktopNavigation
          appName={appName}
          navigations={navigations}
          additionalContent={desktopNavigationAdditionalContent}
          releaseNote={releaseNote}
          enableNew={enableNew}
        />
      )}
    </>
  )
}
