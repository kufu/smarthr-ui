import { type ComponentPropsWithoutRef, type FC, type MouseEvent, memo, useMemo } from 'react'

import { useLatest } from '../../../../hooks/useLatest'
import { type Locale, Localizer, localeMap, useAvailableLocales, useIntl } from '../../../../intl'
import { AnchorButton, Button } from '../../../Button'
import { DropdownMenuButton, DropdownMenuGroup } from '../../../Dropdown'
import { FaCheckIcon, FaGearIcon, FaUserLargeIcon } from '../../../Icon'

import { buildDisplayName } from './buildDisplayName'

import type { HeaderProps, UserInfoProps } from '../../types'

const TRIGGER: ComponentPropsWithoutRef<typeof DropdownMenuButton>['trigger'] = {
  children: <Localizer id="smarthr-ui/AppHeader/MobileHeader/account" defaultText="アカウント" />,
  size: 'S',
  onlyIcon: { component: FaUserLargeIcon },
}

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

// HINT: DropdownMenuButton は DropdownMenuGroup を直接の子として渡された場合のみグループとして扱うため、
// 言語のグループを別コンポーネントに切り出さずここで描画する
const ActualUserInfo: FC<Pick<Props, 'accountUrl' | 'locale'> & { displayName: string }> = ({
  displayName,
  accountUrl,
  locale: localeProps,
}) => {
  const { locale } = useIntl()
  const availableLocales = useAvailableLocales()
  const locales = useMemo(
    () => Object.entries(localeMap).filter(([code]) => availableLocales.includes(code as Locale)),
    [availableLocales],
  )

  const latest = useLatest({ localeProps })

  const functions = useMemo(
    () => ({
      handleClickLocale: (e: MouseEvent<HTMLButtonElement>) => {
        latest.localeProps?.onSelectLocale(e.currentTarget.value as Locale)
      },
    }),
    [latest],
  )

  return (
    <DropdownMenuButton trigger={TRIGGER}>
      <DropdownMenuGroup name={displayName}>
        {accountUrl && (
          <AnchorButton
            href={accountUrl}
            target="_blank"
            rel="noopener noreferrer"
            prefix={<FaGearIcon />}
          >
            <Localizer id="smarthr-ui/AppHeader/userSettings" defaultText="個人設定" />
          </AnchorButton>
        )}
      </DropdownMenuGroup>
      {localeProps && (
        <DropdownMenuGroup name="Language">
          {locales.map(([code, label]) => {
            const isCurrent = code === locale

            return (
              <Button
                key={code}
                value={code}
                aria-current={isCurrent || undefined}
                onClick={functions.handleClickLocale}
                prefix={isCurrent && <FaCheckIcon color="MAIN" />}
              >
                {label}
              </Button>
            )
          })}
        </DropdownMenuGroup>
      )}
    </DropdownMenuButton>
  )
}
