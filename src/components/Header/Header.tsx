import React, { ComponentProps, PropsWithChildren, ReactElement, ReactNode, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Button } from '../Button'
import { Cluster } from '../Layout'
import { SmartHRLogo } from '../SmartHRLogo'
import { Text } from '../Text'

import { HeaderDropdownMenuButton } from '.'

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
  /** テナント一覧 */
  tenants?: Tenant[]
  /** 現在のテナント ID */
  currentTenantId?: string
  /** テナントが選択された時に発火するコールバック関数 */
  onTenantSelect?: (id: string) => void
}

type ElementProps = Omit<ComponentProps<'h1'>, keyof Props>

export const Header: React.FC<PropsWithChildren<Props> & ElementProps> = ({
  logo = <SmartHRLogo className="shr-p-0.75" />,
  logoHref = '/',
  tenants,
  currentTenantId,
  onTenantSelect,
  children,
  className,
}) => {
  const { wrapperStyle, logoLinkStyle, tenantInfoStyle, tenantNameTextStyle, actionsStyle } =
    useMemo(() => {
      const { wrapper, logoLink, tenantInfo, tenantNameText, actions } = header()
      return {
        wrapperStyle: wrapper({ className }),
        logoLinkStyle: logoLink(),
        tenantInfoStyle: tenantInfo(),
        tenantNameTextStyle: tenantNameText(),
        actionsStyle: actions(),
      }
    }, [className])
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
        <Text color="TEXT_WHITE" className={tenantNameTextStyle}>
          {currentTenantName}
        </Text>
      ),
    [currentTenantName, onTenantSelect, tenants, tenantNameTextStyle],
  )

  return (
    <Cluster
      as="header"
      justify="space-between"
      gap={{ column: 0.25, row: 0 }}
      className={wrapperStyle}
    >
      <Cluster align="center" gap={{ column: 0.25, row: 0 }}>
        <a href={logoHref} className={logoLinkStyle}>
          {logo}
        </a>
        {currentTenantName && <div className={tenantInfoStyle}>{tenantInfo}</div>}
      </Cluster>
      <Cluster
        align="center"
        justify="flex-end"
        gap={{ column: 0.5, row: 0.25 }}
        className={actionsStyle}
      >
        {children}
      </Cluster>
    </Cluster>
  )
}
