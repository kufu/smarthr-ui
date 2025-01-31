import React, { ComponentProps, FC, useCallback } from 'react'
import { tv } from 'tailwind-variants'

import { Dropdown, DropdownContent, DropdownTrigger } from '../../../Dropdown'
import { Header } from '../../../Header'
import { FaCaretDownIcon } from '../../../Icon'
import { Text } from '../../../Text'
import { CommonButton } from '../common/CommonButton'

const tenantDropdownTriggerButton = tv({
  base: [
    'shr-border-none shr-bg-white shr-text-start shr-text-sm shr-rounded-s shr-px-0.5 shr-py-0.25 shr-cursor-pointer',
    'hover:shr-bg-white-darken',
    '[&[aria-expanded="true"]>.smarthr-ui-Icon:last-child]:shr-rotate-180',
  ],
})

type Props = {
  tenants?: ComponentProps<typeof Header>['tenants']
  currentTenantId?: ComponentProps<typeof Header>['currentTenantId']
  onTenantSelect?: ComponentProps<typeof Header>['onTenantSelect']
}

export const TenantSelector: FC<Props> = ({ tenants, currentTenantId, onTenantSelect }) => {
  if (!tenants || tenants.length === 0 || !currentTenantId) {
    return null
  }

  const tenantName = tenants.find((tenant) => tenant.id === currentTenantId)?.name

  if (!tenantName) {
    return null
  }

  if (tenants.length === 1 || !onTenantSelect) {
    return <Text as="p">{tenantName}</Text>
  }

  return (
    <TenantDropdown
      tenantName={tenantName}
      tenants={tenants}
      currentTenantId={currentTenantId}
      onTenantSelect={onTenantSelect}
    />
  )
}

const TenantDropdown = React.memo<
  Pick<Required<Props>, 'tenants' | 'currentTenantId' | 'onTenantSelect'> & { tenantName: string }
>(({ tenantName, tenants, currentTenantId, onTenantSelect }) => {
  const onClickTenantName = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (e.getAttribute('data-current') !== 'true') {
        onTenantSelect(e.currentTarget.value)
      }
    },
    [onTenantSelect],
  )

  return (
    <Dropdown>
      <DropdownTrigger>
        <button type="button" className={tenantDropdownTriggerButton()}>
          {tenantName}
          <FaCaretDownIcon className="shr-ms-0.5" color="TEXT_BLACK" />
        </button>
      </DropdownTrigger>

      <DropdownContent controllable>
        <div className="shr-p-0.5">
          {tenants.map((tenant) => (
            <CommonButton
              key={tenant.id}
              elementAs="button"
              type="button"
              current={tenant.id === currentTenantId}
              value={tenant.id}
              onClick={onClickTenantName}
            >
              {tenant.name}
            </CommonButton>
          ))}
        </div>
      </DropdownContent>
    </Dropdown>
  )
})
