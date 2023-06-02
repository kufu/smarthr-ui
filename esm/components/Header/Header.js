import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../Button';
import { Cluster } from '../Layout';
import { SmartHRLogo } from '../SmartHRLogo';
import { Text } from '../Text';
import { useClassNames } from './useClassNames';
import { HeaderDropdownMenuButton } from '.';
export const Header = ({ logo = React.createElement(SmartHRLogo, null), logoHref = '/', tenants, currentTenantId, onTenantSelect, children, className, }) => {
    const theme = useTheme();
    const classNames = useClassNames();
    const currentTenantName = useMemo(() => {
        if (tenants && tenants.length >= 1) {
            const current = tenants.find(({ id }) => id === currentTenantId);
            return current ? current.name : tenants[0].name;
        }
        return undefined;
    }, [currentTenantId, tenants]);
    const tenantInfo = useMemo(() => tenants && tenants.length > 1 ? (React.createElement(HeaderDropdownMenuButton, { label: currentTenantName }, tenants.map(({ id, name }) => (React.createElement(Button, { key: id, onClick: () => onTenantSelect && onTenantSelect(id) }, name))))) : (React.createElement(TenantName, { themes: theme }, currentTenantName)), [currentTenantName, onTenantSelect, tenants, theme]);
    return (React.createElement(Wrapper, { className: `${className} ${classNames.wrapper}`, themes: theme },
        React.createElement(Cluster, { align: "center", gap: { column: 0.25, row: 0 } },
            React.createElement(LogoLink, { href: logoHref, className: classNames.logo, themes: theme }, logo),
            currentTenantName && (React.createElement(TenantInfo, { className: classNames.tenantInfo }, tenantInfo))),
        React.createElement(Actions, { className: classNames.actions }, children)));
};
const Wrapper = styled(Cluster).attrs({
    as: 'header',
    justify: 'space-between',
    gap: { column: 0.25, row: 0 },
}) `
  ${({ themes: { color, spacingByChar } }) => css `
    background-color: ${color.BRAND};
    padding-inline: ${spacingByChar(1.25)};

    @media (max-width: 768px) {
      padding-inline: ${spacingByChar(0.75)};
    }
  `}
`;
const LogoLink = styled.a `
  ${({ themes: { shadow, spacingByChar } }) => css `
    /* ロゴが持つ padding 分だけ調整 */
    margin-inline-start: ${spacingByChar(-0.75)};

    &:focus-visible {
      ${shadow.focusIndicatorStyles}
    }
  `}
`;
const TenantInfo = styled.div `
  margin-inline-start: auto;
`;
const TenantName = styled(Text).attrs({ color: 'TEXT_WHITE' }) `
  ${({ themes: { spacingByChar } }) => css `
    padding-inline: ${spacingByChar(0.25)};
  `}
`;
const Actions = styled(Cluster).attrs({
    align: 'center',
    justify: 'flex-end',
    gap: { column: 0.5, row: 0.25 },
}) `
  margin-inline-start: auto;
`;
//# sourceMappingURL=Header.js.map