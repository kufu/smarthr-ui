import React, {
  type ComponentProps,
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
  memo,
  useMemo,
} from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { Button } from '../Button'
import { Cluster } from '../Layout'
import { SmartHRLogo } from '../SmartHRLogo'
import { Text } from '../Text'

import { AppLauncher, HeaderDropdownMenuButton } from '.'

const classNameGenerator = tv({
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
} & VariantProps<typeof classNameGenerator>

type ElementProps = Omit<ComponentProps<'header'>, keyof Props>

const COMMON_GAP = { column: 0.25, row: 0 } as const
const CHILDREN_GAP = { column: 0.5, row: 0.25 } as const

export const Header: React.FC<PropsWithChildren<Props> & ElementProps> = ({
  enableNew,
  logo,
  logoHref,
  featureName,
  apps,
  tenants,
  currentTenantId,
  onTenantSelect,
  children,
  className,
}) => {
  const classNames = useMemo(() => {
    const {
      wrapper,
      logoLink,
      tenantInfo: tenantInfoStyle,
      tenantNameText,
      actions,
    } = classNameGenerator({ enableNew })

    return {
      wrapper: wrapper({ className }),
      logoLink: logoLink(),
      tenantInfo: tenantInfoStyle(),
      tenantNameText: tenantNameText(),
      actions: actions(),
    }
  }, [enableNew, className])

  return (
    <Cluster as="header" justify="space-between" gap={COMMON_GAP} className={classNames.wrapper}>
      <Cluster align="center" gap={COMMON_GAP}>
        <Logo href={logoHref} enableNew={enableNew} className={classNames.logoLink}>
          {logo}
        </Logo>
        {enableNew ? (
          <MemoizedAppLauncher featureName={featureName} apps={apps} enableNew={enableNew} />
        ) : (
          <TenantSwitcher
            currentTenantId={currentTenantId}
            tenants={tenants}
            classNames={classNames}
            onTenantSelect={onTenantSelect}
          />
        )}
      </Cluster>
      <Cluster align="center" justify="flex-end" gap={CHILDREN_GAP} className={classNames.actions}>
        {children}
      </Cluster>
    </Cluster>
  )
}

const Logo = memo<
  Pick<Props, 'enableNew'> & { children: Props['logo']; href: Props['logoHref']; className: string }
>(({ children, href, enableNew, className }) => (
  <a href={href || '/'} className={className}>
    {children || <SmartHRLogo fill={enableNew ? 'brand' : undefined} className="shr-p-0.75" />}
  </a>
))

const MemoizedAppLauncher = memo<Pick<Props, 'featureName' | 'apps' | 'enableNew'>>(
  ({ featureName, apps = [], enableNew }) => {
    const decorators = useMemo(() => {
      if (!featureName) {
        return undefined
      }

      return { triggerLabel: () => featureName }
    }, [featureName])

    return featureName && <AppLauncher apps={apps} enableNew={enableNew} decorators={decorators} />
  },
)

const TenantSwitcher = memo<
  Pick<Props, 'currentTenantId' | 'tenants' | 'onTenantSelect'> & {
    classNames: { tenantInfo: string; tenantNameText: string }
  }
>(({ currentTenantId, tenants, classNames, onTenantSelect }) => {
  const currentTenantName = useMemo(() => {
    if (tenants && tenants.length >= 1) {
      const current = tenants.find(({ id }) => id === currentTenantId)
      return current ? current.name : tenants[0].name
    }

    return undefined
  }, [currentTenantId, tenants])

  return (
    currentTenantName && (
      <div className={classNames.tenantInfo}>
        {tenants && tenants.length > 1 ? (
          <MultiTenantDropdownMenuButton
            label={currentTenantName}
            tenants={tenants}
            onTenantSelect={onTenantSelect}
          />
        ) : (
          <Text color="TEXT_WHITE" className={classNames.tenantNameText}>
            {currentTenantName}
          </Text>
        )}
      </div>
    )
  )
})

const MultiTenantDropdownMenuButton = memo<
  Pick<Required<Props>, 'tenants'> & Pick<Props, 'onTenantSelect'> & { label: ReactNode }
>(({ label, tenants, onTenantSelect }) => {
  const onClick = useMemo(
    () =>
      onTenantSelect
        ? (e: React.MouseEvent<HTMLButtonElement>) => {
            onTenantSelect(e.currentTarget.value)
          }
        : undefined,
    [onTenantSelect],
  )

  return (
    <HeaderDropdownMenuButton label={label}>
      {tenants.map(({ id, name }) => (
        <Button key={id} value={id} onClick={onClick}>
          {name}
        </Button>
      ))}
    </HeaderDropdownMenuButton>
  )
})
