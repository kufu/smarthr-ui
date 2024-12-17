import React, { FC } from 'react'

import { Header, HeaderLink, LanguageSwitcher } from '../../../Header'
import { FaCircleQuestionIcon, FaGraduationCapIcon, FaRegCircleQuestionIcon } from '../../../Icon'
import { Cluster } from '../../../Layout'
import { useLocale } from '../../hooks/useLocale'
import { useTranslate } from '../../hooks/useTranslate'
import { localeMap } from '../../multilingualization'
import { HeaderProps } from '../../types'
import { Translate } from '../common/Translate'

import { Navigation } from './Navigation'
import { UserInfo } from './UserInfo.tsx'

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
  ...props
}) => {
  const translate = useTranslate()
  const { locale } = useLocale()

  return (
    <>
      <Header
        {...props}
        enableNew={enableNew}
        className={`${className} max-[751px]:!shr-hidden`}
        featureName={appName}
        tenants={tenants}
        currentTenantId={currentTenantId}
      >
        <Cluster align="center" className="shr--me-0.25">
          {!enableNew && schoolUrl && (
            <HeaderLink
              href={schoolUrl}
              prefix={<FaGraduationCapIcon />}
              className="shr-flex shr-items-center shr-py-0.75 shr-leading-none"
            >
              <Translate>{translate('common/school')}</Translate>
            </HeaderLink>
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
              <Translate>{translate('common/help')}</Translate>
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
