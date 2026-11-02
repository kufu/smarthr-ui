import {
  type ComponentPropsWithRef,
  type FC,
  type MouseEvent,
  type ReactNode,
  useMemo,
} from 'react'

import { useLatest } from '../../../../hooks/useLatest'
import { Button } from '../../../Button'
import { DropdownMenuButton } from '../../../Dropdown'
import { FaCheckIcon } from '../../../Icon'

import type { Header } from '../../../Header'

type Props = Pick<
  ComponentPropsWithRef<typeof Header>,
  'tenants' | 'currentTenantId' | 'onTenantSelect'
>

export const MobileTenantSelector: FC<Props> = ({ tenants, currentTenantId, onTenantSelect }) => {
  const tenantName = useMemo(() => {
    if (!tenants || !currentTenantId || tenants.length === 0) {
      return null
    }

    return tenants.find((tenant) => tenant.id === currentTenantId)?.name
  }, [tenants, currentTenantId])

  return tenantName ? (
    <ActualTenantSelector
      currentTenantId={currentTenantId}
      tenants={tenants as ActualProps['tenants']}
      tenantName={tenantName}
      onTenantSelect={onTenantSelect}
    />
  ) : null
}

type ActualProps = Omit<Props, 'tenants'> &
  Required<Pick<Props, 'tenants'>> & { tenantName: ReactNode }

const ActualTenantSelector: FC<ActualProps> = ({
  tenants,
  currentTenantId,
  onTenantSelect,
  tenantName,
}) => {
  if (tenants.length === 1 || !onTenantSelect) {
    return <p>{tenantName}</p>
  }

  return (
    <TenantDropdown
      currentTenantId={currentTenantId}
      tenants={tenants}
      tenantName={tenantName}
      onTenantSelect={onTenantSelect}
    />
  )
}

const TenantDropdown: FC<
  Omit<ActualProps, 'onTenantSelect'> & Required<Pick<ActualProps, 'onTenantSelect'>>
> = ({ tenants, currentTenantId, onTenantSelect, tenantName }) => {
  const latest = useLatest({ onTenantSelect })

  const functions = useMemo(
    () => ({
      handleClickTenantName: (e: MouseEvent<HTMLButtonElement>) => {
        latest.onTenantSelect(e.currentTarget.value)
      },
    }),
    [latest],
  )

  const trigger = useMemo(() => ({ children: tenantName, size: 'S' as const }), [tenantName])

  return (
    <DropdownMenuButton trigger={trigger}>
      {tenants.map((tenant) => {
        const isCurrent = tenant.id === currentTenantId

        return (
          <Button
            key={tenant.id}
            value={tenant.id}
            aria-current={isCurrent || undefined}
            onClick={isCurrent ? undefined : functions.handleClickTenantName}
            prefix={isCurrent && <FaCheckIcon color="MAIN" />}
          >
            {tenant.name}
          </Button>
        )
      })}
    </DropdownMenuButton>
  )
}
