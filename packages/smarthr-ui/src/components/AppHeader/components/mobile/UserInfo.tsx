import { type FC, memo, useCallback, useMemo, useState } from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../../../intl'
import { Button } from '../../../Button'
import { Dialog } from '../../../Dialog'
import { Dropdown, DropdownContent, DropdownTrigger } from '../../../Dropdown'
import { FaGearIcon, FaGlobeIcon, FaUserLargeIcon } from '../../../Icon'
import { useLocale } from '../../hooks/useLocale'
import { buildDisplayName } from '../../utils'
import { CommonButton } from '../common/CommonButton'
import { Translate } from '../common/Translate'

import { LanguageSelector } from './LanguageSelector'

import type { HeaderProps, UserInfoProps } from '../../types'

const classNameGenerator = tv({
  slots: {
    iconButton: ['[&&&]:shr-border-transparent [&&]:shr-p-0.25'],
    iconButtonInner: [
      'shr-border-shorthand shr-block shr-flex shr-items-center shr-justify-center shr-rounded-full shr-bg-white shr-p-0.25',
    ],
    dropdownUserName: ['shr-box-border shr-min-w-[246px] shr-px-1 shr-py-0.75 shr-text-sm'],
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

  const { localize } = useIntl()
  const translated = useMemo(
    () => ({
      account: localize({
        id: 'smarthr-ui/AppHeader/MobileHeader/account',
        defaultText: 'アカウント',
      }),
      userSetting: localize({
        id: 'smarthr-ui/AppHeader/userSettings',
        defaultText: '個人設定',
      }),
    }),
    [localize],
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
          <Button variant="skeleton" size="s" className={classNames.iconButton}>
            <span className={classNames.iconButtonInner}>
              <FaUserLargeIcon alt={translated.account} className="shr-fill-grey" />
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
                  prefix={<FaGlobeIcon aria-hidden={true} />}
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
                  prefix={<FaGearIcon aria-hidden={true} />}
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
          <LanguageSelector locale={locale} onClickClose={dialogClose} />
        </Dialog>
      )}
    </>
  )
}
