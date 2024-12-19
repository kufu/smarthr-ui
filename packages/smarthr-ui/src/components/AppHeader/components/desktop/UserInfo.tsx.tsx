import React, { FC } from 'react'
import { tv } from 'tailwind-variants'

import { AnchorButton, Button } from '../../../Button'
import { Dropdown, DropdownContent, DropdownMenuButton, DropdownTrigger } from '../../../Dropdown'
import { FaCaretDownIcon, FaGearIcon, FaUserIcon } from '../../../Icon'
import { Cluster, Stack } from '../../../Layout'
import { Text } from '../../../Text'
import { useTranslate } from '../../hooks/useTranslate'
import { HeaderProps, UserInfoProps } from '../../types'
import { buildDisplayName } from '../../utils'
import { CommonButton } from '../common/CommonButton'
import { Translate } from '../common/Translate'

// HeaderDropdownMenuButton と同じスタイルを適用
const userInfo = tv({
  slots: {
    userSummary: [
      'shr-relative -shr-mt-0.5 -shr-mx-0.25 shr-p-1',
      // FIXME: smarthr-ui で DropdownMenuButton のグルーピングができるようになったら修正しましょう
      'after:shr-absolute after:shr-content-[""] after:shr-block after:shr-inset-x-0.5 after:shr-bottom-0 after:shr-h-px after:shr-bg-border',
    ],
    dropdownMenuButton: [
      '[&_.smarthr-ui-DropdownMenuButton-trigger]:shr-border-transparent [&_.smarthr-ui-DropdownMenuButton-trigger]:shr-px-0.5 [&_.smarthr-ui-DropdownMenuButton-trigger]:shr-font-normal',
    ],
    dropdownContentButton: [
      '[&&.smarthr-ui-AnchorButton]:shr-p-0.75 [&&.smarthr-ui-AnchorButton]:shr-py-0.75',
      '[&&.smarthr-ui-Button]:shr-p-0.75 [&&.smarthr-ui-Button]:shr-py-0.75',
    ],
    button: [
      '[&&]:shr-border-transparent [&&]:shr-font-normal [&&]:last-of-type:-shr-me-0.25',
      '[&&]:focus-visible:shr-bg-transparent',
      "[&[aria-expanded='true']>.smarthr-ui-Icon:last-child]:shr-rotate-180",
    ],
    dropdownContent: '[&&]:shr-whitespace-pre [&&]:shr-p-0.5',
    accountImage: '',
    placeholderImage: 'shr-p-0.5',
  },
  variants: {
    enableNew: {
      true: {
        button: '[&&]:shr-px-0.5',
      },
      false: {
        button:
          '[&&]:shr-bg-transparent [&&]:hover:shr-bg-transparent [&&]:shr-px-0.25 [&&]:shr-text-white',
      },
    },
  },
  compoundSlots: [
    {
      slots: ['accountImage', 'placeholderImage'],
      className:
        'shr-box-border shr-flex shr-items-center shr-justify-center -shr-my-1 shr-border-shorthand shr-rounded-full shr-bg-white shr-size-2',
    },
  ],
})

export const UserInfo: FC<
  UserInfoProps & Pick<HeaderProps, 'desktopAdditionalContent' | 'tenants' | 'currentTenantId'>
> = ({
  arbitraryDisplayName,
  email,
  empCode,
  firstName,
  lastName,
  tenants,
  currentTenantId,
  accountUrl,
  accountImageUrl,
  desktopAdditionalContent,
  enableNew,
}) => {
  const translate = useTranslate()

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

  if (!accountUrl && !desktopAdditionalContent) {
    return <span className="shr-text-white">{displayName}</span>
  }

  const currentTenantName = tenants?.find((tenant) => tenant.id === currentTenantId)?.name
  const {
    userSummary,
    dropdownMenuButton,
    dropdownContentButton,
    button,
    dropdownContent,
    accountImage,
    placeholderImage,
  } = userInfo({
    enableNew,
  })

  if (enableNew) {
    return (
      <DropdownMenuButton
        className={dropdownMenuButton()}
        label={
          <Cluster as="span" align="center">
            {accountImageUrl ? (
              // eslint-disable-next-line smarthr/a11y-image-has-alt-attribute, jsx-a11y/alt-text
              <img src={accountImageUrl} className={accountImage()} aria-hidden />
            ) : (
              <span className={placeholderImage()}>
                <FaUserIcon color="TEXT_GREY" />
              </span>
            )}

            <Cluster align="center" as="span">
              {/* eslint-disable-next-line smarthr/best-practice-for-layouts */}
              <Stack gap={0} className="-shr-my-1" as="span" align="flex-start">
                {currentTenantName && (
                  <Text size="XS" leading="NORMAL">
                    {currentTenantName}
                  </Text>
                )}

                {firstName && lastName ? (
                  <Text size="XS" leading="NORMAL">
                    {firstName} {lastName}
                  </Text>
                ) : (
                  email && (
                    <Text size="XS" leading="NORMAL">
                      {email}
                    </Text>
                  )
                )}
              </Stack>
            </Cluster>
          </Cluster>
        }
      >
        <Stack gap={0.5} className={userSummary()}>
          <Text size="S" color="TEXT_GREY" weight="bold" leading="TIGHT">
            {currentTenantName}
          </Text>

          {empCode || (firstName && lastName) ? (
            <Cluster align="center">
              {empCode && (
                <Text size="S" color="TEXT_GREY" leading="TIGHT">
                  {empCode}
                </Text>
              )}
              {firstName && lastName && <Text leading="TIGHT">{`${lastName} ${firstName}`}</Text>}
            </Cluster>
          ) : (
            <Text leading="TIGHT">{email}</Text>
          )}
        </Stack>

        {accountUrl && (
          <AnchorButton
            href={accountUrl}
            target="_blank"
            rel="noopener noreferrer"
            prefix={<FaGearIcon />}
            className={dropdownContentButton()}
          >
            <Translate>{translate('common/userSetting')}</Translate>
          </AnchorButton>
        )}

        {desktopAdditionalContent}
      </DropdownMenuButton>
    )
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="text" suffix={<FaCaretDownIcon />} className={button()}>
          <Translate>{displayName}</Translate>
        </Button>
      </DropdownTrigger>

      <DropdownContent className={dropdownContent()}>
        {/* eslint-disable-next-line smarthr/best-practice-for-layouts */}
        <Stack gap={0}>
          {accountUrl && (
            <CommonButton
              elementAs="a"
              href={accountUrl}
              target="_blank"
              rel="noopener noreferrer"
              prefix={<FaGearIcon />}
            >
              <Translate>{translate('common/userSetting')}</Translate>
            </CommonButton>
          )}

          {desktopAdditionalContent}
        </Stack>
      </DropdownContent>
    </Dropdown>
  )
}
