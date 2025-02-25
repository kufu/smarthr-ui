import React, { type FC, memo, useCallback, useMemo, useState } from 'react'
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

const classNameGenerator = tv({
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

export const UserInfo = memo<Props>(
  ({ arbitraryDisplayName, email, empCode, firstName, lastName, accountUrl }) => {
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

    return displayName ? <ActualUserInfo accountUrl={accountUrl} displayName={displayName} /> : null
  },
)

const ActualUserInfo: FC<Pick<Props, 'accountUrl'> & { displayName: string }> = ({
  displayName,
  accountUrl,
}) => {
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false)

  const dialogOpen = useCallback(() => setLanguageDialogOpen(true), [])
  const dialogClose = useCallback(() => setLanguageDialogOpen(false), [])

  const { locale } = useLocale()
  const translate = useTranslate()

  const translated = useMemo(
    () => ({
      account: translate('MobileHeader/UserInfo/account'),
      userSetting: translate('common/userSetting'),
    }),
    [translate],
  )

  const classNames = useMemo(() => {
    const { iconButton, iconButtonInner, dropdownUserName, dropdownButtonArea } =
      classNameGenerator()

    return {
      iconButton: iconButton(),
      iconButtonInner: iconButtonInner(),
      dropdownUserName: dropdownUserName(),
      dropdownButtonArea: dropdownButtonArea(),
    }
  }, [])

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="skeleton" size="s" square className={classNames.iconButton}>
            <span className={classNames.iconButtonInner}>
              <FaUserLargeIcon
                role="img"
                aria-label={translated.account}
                className="shr-fill-grey"
              />
            </span>
          </Button>
        </DropdownTrigger>

        <DropdownContent>
          <div className={classNames.dropdownUserName}>
            <p>{displayName}</p>
          </div>

          {(locale || accountUrl) && (
            <div className={classNames.dropdownButtonArea}>
              {locale && (
                <CommonButton
                  elementAs="button"
                  type="button"
                  onClick={dialogOpen}
                  prefix={<FaGlobeIcon />}
                >
                  Language
                </CommonButton>
              )}

              {accountUrl && (
                <CommonButton
                  elementAs="a"
                  href={accountUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  prefix={<FaGearIcon />}
                >
                  <Translate>{translated.userSetting}</Translate>
                </CommonButton>
              )}
            </div>
          )}
        </DropdownContent>
      </Dropdown>

      {locale && (
        <Dialog isOpen={languageDialogOpen} onClickOverlay={dialogClose} width={246}>
          <LanguageSelector locale={locale} onClickClose={setLanguageDialogOpen} />
        </Dialog>
      )}
    </>
  )
}
