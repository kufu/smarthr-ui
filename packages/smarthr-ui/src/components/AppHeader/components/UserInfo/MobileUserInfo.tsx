import { type FC, memo, useMemo, useState } from 'react'
import { tv } from 'tailwind-variants'

import { Localizer } from '../../../../intl'
import { Button } from '../../../Button'
import { Dialog } from '../../../Dialog'
import { Dropdown, DropdownContent, DropdownTrigger } from '../../../Dropdown'
import { FaGearIcon, FaGlobeIcon, FaUserLargeIcon } from '../../../Icon'
import { Text } from '../../../Text'
import { LanguageSelector } from '../Locale'
import { CommonButton } from '../common/CommonButton'

import { buildDisplayName } from './buildDisplayName'

import type { HeaderProps, UserInfoProps } from '../../types'

const classNameGenerator = tv({
  slots: {
    iconButton: ['[&&&]:shr-border-transparent [&&]:shr-p-0.25'],
    iconButtonInner: [
      'shr-border-shorthand shr-block shr-flex shr-items-center shr-justify-center shr-rounded-full shr-bg-white shr-p-0.25',
    ],
    dropdownUserName: ['shr-box-border shr-min-w-[246px] shr-px-1 shr-py-0.75'],
    dropdownButtonArea: ['shr-border-t-shorthand shr-p-0.5'],
  },
})

const CLASS_NAMES = (() => {
  // eslint-disable-next-line smarthr/best-practice-for-tailwind-variants -- module scopeで定義されており十分にmemo化されている。誤検知
  const { iconButton, iconButtonInner, dropdownUserName, dropdownButtonArea } = classNameGenerator()

  return {
    iconButton: iconButton(),
    iconButtonInner: iconButtonInner(),
    dropdownUserName: dropdownUserName(),
    dropdownButtonArea: dropdownButtonArea(),
  }
})()

type Props = UserInfoProps & Pick<HeaderProps, 'locale'>

export const MobileUserInfo = memo<Props>(
  ({ email, empCode, firstName, lastName, accountUrl, locale }) => {
    const displayName = useMemo(
      () =>
        buildDisplayName({
          email,
          empCode,
          firstName,
          lastName,
        }),
      [email, empCode, firstName, lastName],
    )

    return displayName ? (
      <ActualUserInfo accountUrl={accountUrl} displayName={displayName} locale={locale} />
    ) : null
  },
)

const ActualUserInfo: FC<Pick<Props, 'accountUrl' | 'locale'> & { displayName: string }> = ({
  displayName,
  accountUrl,
  locale,
}) => {
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false)

  const functions = useMemo(
    () => ({
      dialogOpen: () => setLanguageDialogOpen(true),
      dialogClose: () => setLanguageDialogOpen(false),
    }),
    [],
  )

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="skeleton" size="S" className={CLASS_NAMES.iconButton}>
            <span className={CLASS_NAMES.iconButtonInner}>
              <FaUserLargeIcon
                alt={
                  <Localizer
                    id="smarthr-ui/AppHeader/MobileHeader/account"
                    defaultText="アカウント"
                  />
                }
                className="shr-fill-grey"
              />
            </span>
          </Button>
        </DropdownTrigger>

        <DropdownContent>
          <Text as="p" size="S" className={CLASS_NAMES.dropdownUserName}>
            {displayName}
          </Text>

          {(locale || accountUrl) && (
            <div className={CLASS_NAMES.dropdownButtonArea}>
              {locale && (
                <CommonButton
                  elementAs="button"
                  type="button"
                  handleClick={functions.dialogOpen}
                  prefix={<FaGlobeIcon />}
                  // eslint-disable-next-line smarthr/require-i18n-text
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
                  <Localizer id="smarthr-ui/AppHeader/userSettings" defaultText="個人設定" />
                </CommonButton>
              )}
            </div>
          )}
        </DropdownContent>
      </Dropdown>

      {locale && (
        <Dialog isOpen={languageDialogOpen} width={246} onClickOverlay={functions.dialogClose}>
          <LanguageSelector locale={locale} onClickClose={functions.dialogClose} />
        </Dialog>
      )}
    </>
  )
}
