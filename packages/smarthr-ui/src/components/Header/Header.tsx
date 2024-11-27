import React, { ComponentProps, PropsWithChildren, ReactElement, ReactNode, useMemo } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

import { Button } from '../Button'
import { Cluster } from '../Layout'
import { SmartHRLogo } from '../SmartHRLogo'
import { Text } from '../Text'

import { AppLauncher, HeaderDropdownMenuButton } from '.'

const header = tv({
  slots: {
    wrapper: ['smarthr-ui-Header', 'shr-bg-brand shr-px-1.25', 'max-md:shr-px-0.75'],
    logoLink: [
      'smarthr-ui-Header-logoLink',
      /* ロゴが持つ padding 分だけ調整 */
      '-shr-ms-0.75',
      'focus-visible:shr-focus-indicator',
    ],
    tenantInfo: ['smarthr-ui-Header-tenantInfo', 'shr-ms-auto'],
    tenantNameText: 'shr-px-0.25',
    actions: ['smarthr-ui-Header-actions', 'shr-ms-auto'],
  },
  variants: {
    enableNew: {
      true: {
        wrapper: [
          'shr-border-solid shr-border-0 shr-border-t-6 shr-border-t-brand shr-border-b shr-border-b-default shr-bg-white shr-px-1.5',
        ],
        logoLink: '',
        tenantInfo: '',
        tenantNameText: '',
        actions: 'shr-py-0.5',
      },
    },
  },
})

type Tenant = PropsWithChildren<{
  id: string
  name: ReactNode
}>

type Props = {
  /** ロゴ */
  logo?: ReactElement
  /** ロゴリンク */
  logoHref?: string
  /** 機能名（enableNew と合わせて使います） */
  featureName?: ReactNode
  /** 機能群（enableNew と合わせて使います） */
  apps?: ComponentProps<typeof AppLauncher>['apps']
  /** テナント一覧 */
  tenants?: Tenant[]
  /** 現在のテナント ID */
  currentTenantId?: string
  /** テナントが選択された時に発火するコールバック関数 */
  onTenantSelect?: (id: string) => void
  /** @deprecated internal-ui から利用するので使わないでください。 */
  enableNew?: boolean
} & VariantProps<typeof header>

type ElementProps = Omit<ComponentProps<'header'>, keyof Props>

export const Header: React.FC<PropsWithChildren<Props> & ElementProps> = ({
  enableNew,
  logo = <SmartHRLogo fill={enableNew ? 'brand' : undefined} className="shr-p-0.75" />,
  logoHref = '/',
  featureName,
  apps = [],
  tenants,
  currentTenantId,
  onTenantSelect,
  children,
  className,
}) => {
  const {
    wrapper,
    logoLink,
    tenantInfo: tenantInfoStyle,
    tenantNameText,
    actions,
  } = header({ enableNew })
  const currentTenantName = useMemo(() => {
    if (tenants && tenants.length >= 1) {
      const current = tenants.find(({ id }) => id === currentTenantId)
      return current ? current.name : tenants[0].name
    }

    return undefined
  }, [currentTenantId, tenants])
  const tenantInfo = useMemo(
    () =>
      tenants && tenants.length > 1 ? (
        <HeaderDropdownMenuButton label={currentTenantName}>
          {tenants.map(({ id, name }) => (
            <Button key={id} onClick={() => onTenantSelect && onTenantSelect(id)}>
              {name}
            </Button>
          ))}
        </HeaderDropdownMenuButton>
      ) : (
        <Text color="TEXT_WHITE" className={tenantNameText()}>
          {currentTenantName}
        </Text>
      ),
    [currentTenantName, onTenantSelect, tenants, tenantNameText],
  )

  return (
    <Cluster
      as="header"
      justify="space-between"
      gap={{ column: 0.25, row: 0 }}
      className={wrapper({ className })}
    >
      <Cluster align="center" gap={{ column: 0.25, row: 0 }}>
        <a href={logoHref} className={logoLink()}>
          {logo}
        </a>
        {enableNew
          ? featureName && (
              <AppLauncher
                apps={apps}
                enableNew={enableNew}
                decorators={{ triggerLabel: () => featureName }}
              />
            )
          : currentTenantName && <div className={tenantInfoStyle()}>{tenantInfo}</div>}
      </Cluster>
      <Cluster
        align="center"
        justify="flex-end"
        gap={{ column: 0.5, row: 0.25 }}
        className={actions()}
      >
        {children}
      </Cluster>
    </Cluster>
  )
}
