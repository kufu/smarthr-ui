import { type FC, type PropsWithChildren, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../../../intl'
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
import { useLocale } from '../../hooks/useLocale'
import { localeMap } from '../../multilingualization'
import { Translate } from '../common/Translate'

import { AppLauncher } from './AppLauncher'
import { Navigation } from './Navigation'
import { UserInfo } from './UserInfo'

import type { HeaderProps } from '../../types'

const classNameGenerator = tv({
  slots: {
    wrapper: 'narrow:!shr-hidden',
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
  ...props
}) => {
  const classNames = useMemo(() => {
    const { wrapper, appsButton } = classNameGenerator()

    return {
      wrapper: wrapper({ className }),
      appsButton: appsButton(),
    }
  }, [className])

  const { locale } = useLocale()

  const { localize } = useIntl()
  const translated = useMemo(
    () => ({
      appLauncherLabel: localize({
        id: 'smarthr-ui/AppHeader/DesktopHeader/appLauncherLabel',
        defaultText: 'アプリ',
      }),
      school: localize({ id: 'smarthr-ui/AppHeader/school', defaultText: 'スクール' }),
      help: localize({ id: 'smarthr-ui/AppHeader/help', defaultText: 'ヘルプ' }),
    }),
    [localize],
  )

  return (
    <>
      <Header
        {...props}
        enableNew={enableNew}
        className={classNames.wrapper}
        featureName={appName}
        tenants={tenants}
        currentTenantId={currentTenantId}
      >
        <Cluster align="center" className="shr--me-0.25">
          {!enableNew && (
            <>
              {features && features.length > 0 && (
                <Dropdown>
                  <AppLauncherButton enableNew={enableNew} className={classNames.appsButton}>
                    {translated.appLauncherLabel}
                  </AppLauncherButton>
                  <DropdownContent controllable>
                    <AppLauncher features={features} />
                  </DropdownContent>
                </Dropdown>
              )}

              {schoolUrl && (
                <HeaderLink
                  href={schoolUrl}
                  prefix={<FaGraduationCapIcon />}
                  className="shr-flex shr-items-center shr-py-0.75 shr-leading-none"
                >
                  <Translate>{translated.school}</Translate>
                </HeaderLink>
              )}
            </>
          )}

          {helpPageUrl && (
            <HeaderLink
              href={helpPageUrl}
              prefix={enableNew ? <FaRegCircleQuestionIcon /> : <FaCircleQuestionIcon />}
              className={
                enableNew ? undefined : 'shr-flex shr-items-center shr-py-0.75 shr-leading-none'
              }
              enableNew={enableNew}
            >
              <Translate>{translated.help}</Translate>
            </HeaderLink>
          )}

          {locale && (
            <LanguageSwitcher
              localeMap={localeMap}
              locale={locale.selectedLocale}
              onLanguageSelect={locale.onSelectLocale as (locale: string) => void}
              enableNew={enableNew}
            />
          )}

          {children}

          {userInfo && (
            <UserInfo
              {...userInfo}
              tenants={tenants}
              currentTenantId={currentTenantId}
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
    <Button prefix={enableNew ?? <FaToolboxIcon />} className={className}>
      <Translate>{children}</Translate>
    </Button>
  </DropdownTrigger>
))
