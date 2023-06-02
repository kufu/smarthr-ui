"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Header = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const Button_1 = require("../Button");
const Layout_1 = require("../Layout");
const SmartHRLogo_1 = require("../SmartHRLogo");
const Text_1 = require("../Text");
const useClassNames_1 = require("./useClassNames");
const _1 = require(".");
const Header = ({ logo = react_1.default.createElement(SmartHRLogo_1.SmartHRLogo, null), logoHref = '/', tenants, currentTenantId, onTenantSelect, children, className, }) => {
    const theme = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useClassNames)();
    const currentTenantName = (0, react_1.useMemo)(() => {
        if (tenants && tenants.length >= 1) {
            const current = tenants.find(({ id }) => id === currentTenantId);
            return current ? current.name : tenants[0].name;
        }
        return undefined;
    }, [currentTenantId, tenants]);
    const tenantInfo = (0, react_1.useMemo)(() => tenants && tenants.length > 1 ? (react_1.default.createElement(_1.HeaderDropdownMenuButton, { label: currentTenantName }, tenants.map(({ id, name }) => (react_1.default.createElement(Button_1.Button, { key: id, onClick: () => onTenantSelect && onTenantSelect(id) }, name))))) : (react_1.default.createElement(TenantName, { themes: theme }, currentTenantName)), [currentTenantName, onTenantSelect, tenants, theme]);
    return (react_1.default.createElement(Wrapper, { className: `${className} ${classNames.wrapper}`, themes: theme },
        react_1.default.createElement(Layout_1.Cluster, { align: "center", gap: { column: 0.25, row: 0 } },
            react_1.default.createElement(LogoLink, { href: logoHref, className: classNames.logo, themes: theme }, logo),
            currentTenantName && (react_1.default.createElement(TenantInfo, { className: classNames.tenantInfo }, tenantInfo))),
        react_1.default.createElement(Actions, { className: classNames.actions }, children)));
};
exports.Header = Header;
const Wrapper = (0, styled_components_1.default)(Layout_1.Cluster).attrs({
    as: 'header',
    justify: 'space-between',
    gap: { column: 0.25, row: 0 },
}) `
  ${({ themes: { color, spacingByChar } }) => (0, styled_components_1.css) `
    background-color: ${color.BRAND};
    padding-inline: ${spacingByChar(1.25)};

    @media (max-width: 768px) {
      padding-inline: ${spacingByChar(0.75)};
    }
  `}
`;
const LogoLink = styled_components_1.default.a `
  ${({ themes: { shadow, spacingByChar } }) => (0, styled_components_1.css) `
    /* ロゴが持つ padding 分だけ調整 */
    margin-inline-start: ${spacingByChar(-0.75)};

    &:focus-visible {
      ${shadow.focusIndicatorStyles}
    }
  `}
`;
const TenantInfo = styled_components_1.default.div `
  margin-inline-start: auto;
`;
const TenantName = (0, styled_components_1.default)(Text_1.Text).attrs({ color: 'TEXT_WHITE' }) `
  ${({ themes: { spacingByChar } }) => (0, styled_components_1.css) `
    padding-inline: ${spacingByChar(0.25)};
  `}
`;
const Actions = (0, styled_components_1.default)(Layout_1.Cluster).attrs({
    align: 'center',
    justify: 'flex-end',
    gap: { column: 0.5, row: 0.25 },
}) `
  margin-inline-start: auto;
`;
//# sourceMappingURL=Header.js.map