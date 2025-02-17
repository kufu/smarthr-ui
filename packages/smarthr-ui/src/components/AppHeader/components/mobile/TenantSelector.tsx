import React, { type ComponentProps, type FC, type ReactNode, useMemo } from 'react'
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
  const tenantName = useMemo(() => {
    if (!tenants || !currentTenantId || tenants.length === 0) {
      return null
    }

    return tenants.find((tenant) => tenant.id === currentTenantId)?.name
  }, [tenants, currentTenantId])

  return tenantName ? (
    <ActualTenantSelector
      tenants={tenants}
      currentTenantId={currentTenantId}
      onTenantSelect={onTenantSelect}
      tenantName={tenantName}
    />
  ) : null
}

const ActualTenantSelector: FC<Props & { tenantName: ReactNode }> = ({
  tenants,
  currentTenantId,
  onTenantSelect,
  tenantName,
}) => {
  if (tenants.length === 1 || !onTenantSelect) {
    return <Text as="p">{tenantName}</Text>
  }

  return (
    <Dropdown>
      {}
      <DropdownTrigger>
        <button type="button" className={tenantDropdownTriggerButton()}>
          {tenantName}
          <FaCaretDownIcon className="shr-ms-0.5" color="TEXT_BLACK" />
        </button>
      </DropdownTrigger>

      <DropdownContent controllable>
        <div className="shr-p-0.5">
          {tenants.map((tenant) => {
            const isCurrent = tenant.id === currentTenantId

            return (
              <CommonButton
                elementAs="button"
                type="button"
                current={isCurrent}
                key={tenant.id}
                onClick={() => !isCurrent && onTenantSelect(tenant.id)}
              >
                {tenant.name}
              </CommonButton>
            )
          })}
        </div>
      </DropdownContent>
    </Dropdown>
  )
}
