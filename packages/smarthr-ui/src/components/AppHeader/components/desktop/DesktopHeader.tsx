import React, { FC } from 'react'
import { tv } from 'tailwind-variants'

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
import { Localizer } from '../../../../intl/Localizer'
import { HeaderProps } from '../../types'

import { AppLauncher } from './AppLauncher'
import { Navigation } from './Navigation'
import { UserInfo } from './UserInfo'

const desktopHeader = tv({
  slots: {
    wrapper: 'max-[751px]:!shr-hidden',
    appsButton: [
      'shr-border-none shr-font-normal shr-text-white shr-bg-transparent shr-px-0.25',
      'hover:shr-border-transparent hover:shr-bg-transparent',
      'focus-visible:shr-border-transparent focus-visible:shr-bg-transparent',
      'forced-colors:shr-border-shorthand',
    ],
  },
  variants: {
    enableNew: {
      true: {
        appsButton: [
          'shr-px-0.5 shr-font-bold shr-text-black',
          '[&_>_svg]:aria-expanded:shr-rotate-180',
          'hover:shr-bg-white-darken',
          'focus-visible:shr-bg-white-darken',
        ],
      },
    },
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
  const { wrapper, appsButton } = desktopHeader()

  return (
    <>
      <Header
        {...props}
        enableNew={enableNew}
        className={`${className} ${wrapper()}`}
        featureName={appName}
        tenants={tenants}
        currentTenantId={currentTenantId}
      >
        <Cluster align="center" className="shr--me-0.25">
          {!enableNew && (
            <>
              {features && features.length > 0 && (
                <Dropdown>
                  <DropdownTrigger>
                    <Button prefix={enableNew ?? <FaToolboxIcon />} className={appsButton()}>
                      <Localizer
                        id="smarthr-ui/AppHeader/appLauncherLabel"
                        defaultText="アプリ"
                        values={{}}
                      />
                    </Button>
                  </DropdownTrigger>

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
                  <Localizer id="smarthr-ui/AppHeader/school" defaultText="スクール" values={{}} />
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
              <Localizer id="smarthr-ui/AppHeader/help" defaultText="ヘルプ" values={{}} />
            </HeaderLink>
          )}

          {props.locale && (
            <LanguageSwitcher
              localeMap={{
                ja: '日本語',
                'id-id': 'Bahasa Indonesia',
                'en-us': 'English',
                pt: 'Português',
                vi: 'Tiếng Việt',
                ko: '한国語',
                'zh-cn': '简体中文',
                'zh-tw': '繁體中文',
              }}
              locale={props.locale.selectedLocale}
              onLanguageSelect={props.locale.onSelectLocale as (locale: string) => void}
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
