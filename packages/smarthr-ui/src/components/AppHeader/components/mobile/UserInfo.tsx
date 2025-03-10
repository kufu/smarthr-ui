import React, { FC, useState } from 'react'
import { tv } from 'tailwind-variants'

import { Button } from '../../../Button'
import { Dialog } from '../../../Dialog'
import { Dropdown, DropdownContent, DropdownTrigger } from '../../../Dropdown'
import { FaGearIcon, FaGlobeIcon, FaUserLargeIcon } from '../../../Icon'
import { useIntl } from '../../../..'
import { Localizer } from '../../../../intl/Localizer'
import { HeaderProps, UserInfoProps } from '../../types'
import { buildDisplayName } from '../../utils'
import { CommonButton } from '../common/CommonButton'

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

export const UserInfo: FC<UserInfoProps & Pick<HeaderProps, 'locale'>> = ({
  arbitraryDisplayName,
  email,
  empCode,
  firstName,
  lastName,
  accountUrl,
  locale,
}) => {
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false)
  const { localize } = useIntl()

  const displayName =
    arbitraryDisplayName ??
    buildDisplayName({
      email,
      empCode,
      firstName,
      lastName,
    })

  if (!displayName) {
    return null
  }

  const { iconButton, iconButtonInner, dropdownUserName, dropdownButtonArea } = userInfo()

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="skeleton" size="s" square className={iconButton()}>
            <span className={iconButtonInner()}>
              <FaUserLargeIcon
                role="img"
                aria-label={localize({
                  id: 'smarthr-ui/AppHeader/account',
                  defaultText: 'アカウント',
                })}
                className="shr-fill-grey"
              />
            </span>
          </Button>
        </DropdownTrigger>

        <DropdownContent>
          <div className={dropdownUserName()}>
            <p>{displayName}</p>
          </div>

          {(locale || accountUrl) && (
            <div className={dropdownButtonArea()}>
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

              {accountUrl && (
                <CommonButton
                  elementAs="a"
                  href={accountUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  prefix={<FaGearIcon />}
                >
                  <Localizer
                    id="smarthr-ui/AppHeader/userSetting"
                    defaultText="個人設定"
                    values={{}}
                  />
                </CommonButton>
              )}
            </div>
          )}
        </DropdownContent>
      </Dropdown>

      {locale && (
        <Dialog
          isOpen={languageDialogOpen}
          onClickOverlay={() => setLanguageDialogOpen(false)}
          width={246}
        >
          <LanguageSelector locale={locale} onClickClose={setLanguageDialogOpen} />
        </Dialog>
      )}
    </>
  )
}
