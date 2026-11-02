import { type FC, type PropsWithChildren, type ReactNode, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Localizer } from '../../../../intl'
import { AnchorButton } from '../../../Button'
import { DropdownMenuButton } from '../../../Dropdown'
import { HeaderDropdownMenuButton } from '../../../Header'
import { FaGearIcon, FaUserIcon } from '../../../Icon'
import { Cluster, Stack } from '../../../Layout'
import { Text } from '../../../Text'

import { buildDisplayName } from './buildDisplayName'

import type { HeaderProps, UserInfoProps } from '../../types'

// HeaderDropdownMenuButton と同じスタイルを適用
const classNameGenerator = tv({
  slots: {
    userSummary: [
      'shr-relative -shr-mx-0.25 -shr-mt-0.5 shr-p-1',
      // FIXME: smarthr-ui で DropdownMenuButton のグルーピングができるようになったら修正しましょう
      'after:shr-absolute after:shr-inset-x-0.5 after:shr-bottom-0 after:shr-block after:shr-h-px after:shr-bg-border after:shr-content-[""]',
    ],
    dropdownMenuButton: [
      '[&_.smarthr-ui-DropdownMenuButton-trigger]:shr-border-transparent [&_.smarthr-ui-DropdownMenuButton-trigger]:shr-px-0.5 [&_.smarthr-ui-DropdownMenuButton-trigger]:shr-font-normal',
    ],
    dropdownContentButton: [
      '[&&.smarthr-ui-AnchorButton]:shr-p-0.75 [&&.smarthr-ui-AnchorButton]:shr-py-0.75',
      '[&&.smarthr-ui-Button]:shr-p-0.75 [&&.smarthr-ui-Button]:shr-py-0.75',
    ],
    accountImage: '',
    placeholderImage: 'shr-p-0.5',
  },
  compoundSlots: [
    {
      slots: ['accountImage', 'placeholderImage'],
      className:
        'shr-border-shorthand -shr-my-1 shr-box-border shr-flex shr-size-2 shr-items-center shr-justify-center shr-rounded-full shr-bg-white',
    },
  ],
})

const CLASS_NAMES = (() => {
  const { userSummary, dropdownMenuButton, dropdownContentButton, accountImage, placeholderImage } =
    // eslint-disable-next-line smarthr/best-practice-for-tailwind-variants -- module scopeで定義されており十分にmemo化されている。誤検知
    classNameGenerator()

  return {
    userSummary: userSummary(),
    dropdownMenuButton: dropdownMenuButton(),
    dropdownContentButton: dropdownContentButton(),
    accountImage: accountImage(),
    placeholderImage: placeholderImage(),
  }
})()

type Props = UserInfoProps &
  Pick<HeaderProps, 'desktopAdditionalContent' | 'tenants' | 'currentTenantId'>

export const DesktopUserInfo: FC<Props> = ({
  email,
  empCode,
  firstName,
  lastName,
  accountUrl,
  desktopAdditionalContent,
  ...rest
}) => {
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

  if (!displayName) {
    return null
  }

  if (!accountUrl && !desktopAdditionalContent) {
    return <Text color="TEXT_WHITE">{displayName}</Text>
  }

  return (
    <ActualUserInfo
      {...rest}
      email={email}
      empCode={empCode}
      firstName={firstName}
      lastName={lastName}
      accountUrl={accountUrl}
      desktopAdditionalContent={desktopAdditionalContent}
      displayName={displayName}
    />
  )
}

const ActualUserInfo: FC<Props & { displayName: string }> = ({
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
  displayName,
}) => {
  const currentTenantName = useMemo(
    () => tenants?.find((tenant) => tenant.id === currentTenantId)?.name,
    [tenants, currentTenantId],
  )

  if (enableNew) {
    return (
      <DropdownMenuButton
        className={CLASS_NAMES.dropdownMenuButton}
        trigger={
          <DropdownMenuLabel
            firstName={firstName}
            lastName={lastName}
            email={email}
            accountImageUrl={accountImageUrl}
            currentTenantName={currentTenantName}
            accountImageClassName={CLASS_NAMES.accountImage}
            placeHolderImageClassName={CLASS_NAMES.placeholderImage}
          />
        }
      >
        <UserSummaryStack
          currentTenantName={currentTenantName}
          empCode={empCode}
          firstName={firstName}
          lastName={lastName}
          email={email}
          className={CLASS_NAMES.userSummary}
        />
        <DropdownContentButton href={accountUrl} className={CLASS_NAMES.dropdownContentButton}>
          <Localizer id="smarthr-ui/AppHeader/userSettings" defaultText="個人設定" />
        </DropdownContentButton>
        {desktopAdditionalContent}
      </DropdownMenuButton>
    )
  }

  return (
    <HeaderDropdownMenuButton trigger={displayName}>
      <AccountLink href={accountUrl}>
        <Localizer id="smarthr-ui/AppHeader/userSettings" defaultText="個人設定" />
      </AccountLink>
      {desktopAdditionalContent}
    </HeaderDropdownMenuButton>
  )
}

const DropdownMenuLabel = memo<
  Pick<Props, 'firstName' | 'lastName' | 'email'> & {
    accountImageUrl?: string
    currentTenantName: ReactNode
    accountImageClassName: string
    placeHolderImageClassName: string
  }
>(
  ({
    firstName,
    lastName,
    email,
    accountImageUrl,
    currentTenantName,
    accountImageClassName,
    placeHolderImageClassName,
  }) => {
    const body: ReactNode[] = []

    if (currentTenantName) {
      body.push(currentTenantName)
    }

    if (firstName && lastName) {
      body.push(`${firstName} ${lastName}`)
    } else if (email) {
      body.push(email)
    }

    if (body.length === 2) {
      body.splice(1, 0, <br />)
    }

    return (
      <Cluster as="span" align="flex-start">
        {accountImageUrl ? (
          // eslint-disable-next-line smarthr/a11y-image-has-alt-attribute, jsx-a11y/alt-text
          <img src={accountImageUrl} className={accountImageClassName} aria-hidden />
        ) : (
          <span className={placeHolderImageClassName}>
            <FaUserIcon color="TEXT_GREY" />
          </span>
        )}

        <Text size="XS" leading="NORMAL" className="-shr-my-1 shr-text-left">
          {body}
        </Text>
      </Cluster>
    )
  },
)

const UserSummaryStack = memo<
  Pick<Props, 'empCode' | 'firstName' | 'lastName' | 'email'> & {
    currentTenantName: ReactNode
    className: string
  }
>(({ currentTenantName, empCode, firstName, lastName, email, className }) => (
  <Stack gap={0.5} className={className}>
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
))

const DropdownContentButton = memo<PropsWithChildren<{ href?: string | null; className: string }>>(
  ({ href, children, className }) =>
    href && (
      <AnchorButton
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        prefix={<FaGearIcon />}
      >
        {children}
      </AnchorButton>
    ),
)

const AccountLink = memo<PropsWithChildren<{ href?: string | null }>>(
  ({ href, children }) =>
    href && (
      <AnchorButton href={href} target="_blank" rel="noopener noreferrer" prefix={<FaGearIcon />}>
        {children}
      </AnchorButton>
    ),
)
