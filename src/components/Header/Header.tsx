import React, { HTMLAttributes, ReactElement, useMemo } from 'react'
import styled, { css } from 'styled-components'

import { useClassNames } from './useClassNames'
import { Cluster } from '../Layout'
import { SmartHRLogo } from '../SmartHRLogo'
import { Text } from '../Text'
import { HeaderDropdownButton } from './'
import { Button } from '../Button'

type Tenant = {
  id: string
  name: string
}
type Props = {
  /** ロゴ */
  logo?: ReactElement
  /** ロゴリンク */
  logoHref?: string
  /** テナント */
  tenants?: string | Tenant[]
  /** 現在のテナント ID */
  currentTenantId?: string
  /** テナントが選択された時に発火するコールバック関数 */
  onTenantSelect?: (id: string) => void
  /** 操作領域 */
  children?: React.ReactNode
}
type ElementProps = Omit<HTMLAttributes<HTMLElement>, keyof Props>

export const Header: React.VFC<Props & ElementProps> = ({
  logo = <SmartHRLogo height="1.5em" />,
  logoHref = '/',
  tenants,
  currentTenantId,
  onTenantSelect,
  children,
}) => {
  const classNames = useClassNames()
  const currentTenantName = useMemo(() => {
    if (Array.isArray(tenants)) {
      const current = tenants.find(({ id }) => id === currentTenantId)
      return current ? current.name : tenants[0].name
    }

    return tenants
  }, [currentTenantId, tenants])
  const tenantInfo = useMemo(
    () =>
      Array.isArray(tenants) ? (
        <HeaderDropdownButton label={currentTenantName}>
          {tenants.map(({ id, name }) => (
            <Button key={id} onClick={() => onTenantSelect && onTenantSelect(id)}>
              {name}
            </Button>
          ))}
        </HeaderDropdownButton>
      ) : (
        <TenantName>{currentTenantName}</TenantName>
      ),
    [currentTenantName, onTenantSelect, tenants],
  )

  return (
    <Wrapper className={classNames.wrapper}>
      <Cluster align="center" gap={{ column: 0.25, row: 0 }}>
        <LogoLink href={logoHref} className={classNames.logo}>
          {logo}
        </LogoLink>
        {currentTenantName && (
          <TenantInfo className={classNames.tenantInfo}>{tenantInfo}</TenantInfo>
        )}
      </Cluster>
      <Actions className={classNames.actions}>{children}</Actions>
    </Wrapper>
  )
}

const Wrapper = styled(Cluster).attrs({
  as: 'header',
  justify: 'space-between',
  gap: { column: 0.25, row: 0 },
})`
  ${({ theme: { color, spacingByChar } }) => css`
    background-color: ${color.BRAND};
    padding-inline: ${spacingByChar(1.25)};

    @media (max-width: 768px) {
      padding-inline: ${spacingByChar(0.75)};
    }
  `}
`
const LogoLink = styled.a`
  ${({ theme: { shadow, spacingByChar } }) => css`
    /* ロゴが持つ padding 分だけ調整 */
    margin-inline-start: ${spacingByChar(-0.75)};

    &:focus-visible {
      ${shadow.focusIndicatorStyles}
    }
  `}
`
const TenantInfo = styled.div`
  margin-inline-start: auto;
`
const TenantName = styled(Text).attrs({ color: 'TEXT_WHITE' })`
  ${({ theme: { spacingByChar } }) => css`
    padding-inline: ${spacingByChar(0.25)};
  `}
`
const Actions = styled(Cluster).attrs({
  align: 'center',
  justify: 'flex-end',
  gap: { column: 0.5, row: 0.25 },
})`
  margin-inline-start: auto;
`
