import { type FC, type PropsWithChildren, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Localizer, localeMap, useIntl } from '../../../../intl'
import { Button } from '../../../Button'
import { Dropdown, DropdownContent, DropdownTrigger } from '../../../Dropdown'
import { Header, HeaderLink, LanguageSwitcher } from '../../../Header'
import {
  FaCircleQuestionIcon,
  FaGraduationCapIcon,
  FaRegCircleQuestionIcon,
  FaToolboxIcon,
} from '../../../Icon'
import { Cluster } from '../../../Layout'
import { Translate } from '../common/Translate'

import { AppLauncher } from './AppLauncher'
import { Navigation } from './Navigation'
import { UserInfo } from './UserInfo'

import type { HeaderProps } from '../../types'

const classNameGenerator = tv({
  slots: {
    wrapper: 'max-[751px]:!shr-hidden',
    appsButton: [
      'shr-border-none shr-bg-transparent shr-px-0.25 shr-font-normal shr-text-white',
      'hover:shr-border-transparent hover:shr-bg-transparent',
      'focus-visible:shr-border-transparent focus-visible:shr-bg-transparent',
      'forced-colors:shr-border-shorthand',
    ],
  },
})

export const DesktopHeader: FC<HeaderProps> = ({
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
  locale: localeProps,
  ...rest
}) => {
  const classNames = useMemo(() => {
    const { wrapper, appsButton } = classNameGenerator()

    return {
      wrapper: wrapper({ className }),
      appsButton: appsButton(),
    }
  }, [className])

  const { locale } = useIntl()

  return (
    <>
      <Header
        {...rest}
        currentTenantId={currentTenantId}
        enableNew={enableNew}
        featureName={appName}
        tenants={tenants}
        className={classNames.wrapper}
      >
        <Cluster align="center" className="shr--me-0.25">
          {!enableNew && (
            <>
              {features && features.length > 0 && (
                <Dropdown>
                  <AppLauncherButton enableNew={enableNew} className={classNames.appsButton}>
                    <Localizer
                      id="smarthr-ui/AppHeader/DesktopHeader/appLauncherLabel"
                      defaultText="アプリ"
                    />
                  </AppLauncherButton>
                  <DropdownContent controllable>
                    <AppLauncher features={features} />
                  </DropdownContent>
                </Dropdown>
              )}

              {schoolUrl && (
                <HeaderLink
                  href={schoolUrl}
                  className="shr-flex shr-items-center shr-py-0.75 shr-leading-none"
                  prefix={<FaGraduationCapIcon />}
                >
                  <Translate>
                    <Localizer id="smarthr-ui/AppHeader/school" defaultText="スクール" />
                  </Translate>
                </HeaderLink>
              )}
            </>
          )}

          {helpPageUrl && (
            <HeaderLink
              href={helpPageUrl}
              rel="help"
              referrerPolicy="no-referrer-when-downgrade"
              enableNew={enableNew}
              className={
                enableNew ? undefined : 'shr-flex shr-items-center shr-py-0.75 shr-leading-none'
              }
              prefix={enableNew ? <FaRegCircleQuestionIcon /> : <FaCircleQuestionIcon />}
            >
              <Translate>
                <Localizer id="smarthr-ui/AppHeader/help" defaultText="ヘルプ" />
              </Translate>
            </HeaderLink>
          )}

          {localeProps && (
            <LanguageSwitcher
              localeMap={localeMap}
              locale={locale}
              enableNew={enableNew}
              onLanguageSelect={localeProps.onSelectLocale as (locale: string) => void}
            />
          )}

          {children}

          {userInfo && (
            <UserInfo
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
        <Navigation
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

const AppLauncherButton = memo<
  Pick<HeaderProps, 'enableNew'> & PropsWithChildren<{ className: string }>
>(({ enableNew, children, className }) => (
  <DropdownTrigger>
    <Button className={className} prefix={enableNew ?? <FaToolboxIcon />}>
      <Translate>{children}</Translate>
    </Button>
  </DropdownTrigger>
))
