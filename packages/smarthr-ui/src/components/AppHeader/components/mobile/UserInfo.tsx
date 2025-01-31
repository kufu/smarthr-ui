import React, { FC, PropsWithChildren, useCallback, useMemo, useState } from 'react'
import { tv } from 'tailwind-variants'

import { Button } from '../../../Button'
import { Dialog } from '../../../Dialog'
import { Dropdown, DropdownContent, DropdownTrigger } from '../../../Dropdown'
import { FaGearIcon, FaGlobeIcon, FaUserLargeIcon } from '../../../Icon'
import { useLocale } from '../../hooks/useLocale'
import { useTranslate } from '../../hooks/useTranslate'
import { HeaderProps, UserInfoProps } from '../../types'
import { buildDisplayName } from '../../utils'
import { CommonButton } from '../common/CommonButton'
import { Translate } from '../common/Translate'

import { LanguageSelector } from './LanguageSelector'

const userInfo = tv({
  slots: {
    iconButton: ['[&&&]:shr-border-transparent [&&]:shr-p-0.25'],
    iconButtonInner: [
      'shr-block shr-flex shr-items-center shr-justify-center shr-p-0.25 shr-bg-white shr-border-shorthand shr-rounded-full',
    ],
    dropdownUserName: ['shr-box-border shr-text-sm shr-px-1 shr-py-0.75 shr-min-w-[246px]'],
    dropdownButtonArea: ['shr-border-t-shorthand shr-p-0.5'],
  },
})

type Props = UserInfoProps & Pick<HeaderProps, 'locale'>

type ExistLocaleType = Exclude<ReturnType<typeof useLocale>['locale'], null>

export const UserInfo: FC<Props> = ({
  arbitraryDisplayName,
  email,
  empCode,
  firstName,
  lastName,
  accountUrl,
}) => {
  const displayName = useMemo(
    () =>
      arbitraryDisplayName ??
      buildDisplayName({
        email,
        empCode,
        firstName,
        lastName,
      }),
    [arbitraryDisplayName, email, empCode, firstName, lastName],
  )

  if (!displayName) {
    return null
  }

  return <ActualUserInfo accountUrl={accountUrl} displayName={displayName} />
}

const ActualUserInfo: FC<Pick<Props, 'accountUrl'> & { displayName: string }> = ({
  accountUrl,
  displayName,
}) => {
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false)
  const { locale } = useLocale()
  const translate = useTranslate()

  const styles = useMemo(() => {
    const { iconButton, iconButtonInner, dropdownUserName, dropdownButtonArea } = userInfo()

    return {
      iconButton: iconButton(),
      iconButtonInner: iconButtonInner(),
      dropdownUserName: dropdownUserName(),
      dropdownButtonArea: dropdownButtonArea(),
    }
  }, [])
  const tlanslated = useMemo(
    () => ({
      account: translate('MobileHeader/UserInfo/account'),
      userSetting: translate('common/userSetting'),
    }),
    [translate],
  )

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="skeleton" size="s" square className={styles.iconButton}>
            <span className={styles.iconButtonInner}>
              <FaUserLargeIcon
                role="img"
                aria-label={tlanslated.account}
                className="shr-fill-grey"
              />
            </span>
          </Button>
        </DropdownTrigger>

        <DropdownContent>
          <div className={styles.dropdownUserName}>
            <p>{displayName}</p>
          </div>

          {(locale || accountUrl) && (
            <div className={styles.dropdownButtonArea}>
              {locale && (
                <CommonButton
                  elementAs="button"
                  type="button"
                  onClick={() => setLanguageDialogOpen(true)}
                  prefix={<FaGlobeIcon />}
                >
                  Language
                </CommonButton>
              )}

              <AccountURLButton href={accountUrl}>{tlanslated.userSetting}</AccountURLButton>
            </div>
          )}
        </DropdownContent>
      </Dropdown>

      {locale && (
        <LanguageDialog
          locale={locale}
          isOpen={languageDialogOpen}
          setOpen={setLanguageDialogOpen}
        />
      )}
    </>
  )
}

const AccountURLButton = React.memo<PropsWithChildren<{ href?: string | null }>>(({ href, children }) => (
  href && (
    <CommonButton
      elementAs="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      prefix={<FaGearIcon />}
    >
      <Translate>{children}</Translate>
    </CommonButton>
  )
))

const LanguageDialog = React.memo<{
  locale: ExistLocaleType
  isOpen: boolean
  setOpen: (flg: boolean) => void
}>(({ locale, isOpen, setOpen }) => {
  const onClickOverlay = useCallback(() => setOpen(false), [setOpen])

  return (
    <Dialog isOpen={isOpen} onClickOverlay={onClickOverlay} width={246}>
      <LanguageSelector locale={locale} onClickClose={setOpen} />
    </Dialog>
  )
})
