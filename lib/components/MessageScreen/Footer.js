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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Footer = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const useClassNames_1 = require("./useClassNames");
const Footer = ({ className = '', ...props }) => {
    const theme = (0, useTheme_1.useTheme)();
    const { footer } = (0, useClassNames_1.useClassNames)();
    return (react_1.default.createElement(Wrapper, { ...props, themes: theme, className: `${footer} ${className}` },
        react_1.default.createElement(List, { themes: theme },
            react_1.default.createElement(Item, { href: "https://support.smarthr.jp/" }, "\u30D8\u30EB\u30D7"),
            react_1.default.createElement(Item, { href: "https://smarthr.jp/update/" }, "\u304A\u77E5\u3089\u305B"),
            react_1.default.createElement(Item, { href: "https://smarthr.jp/terms/" }, "\u5229\u7528\u898F\u7D04"),
            react_1.default.createElement(Item, { href: "https://smarthr.co.jp/privacy/" }, "\u30D7\u30E9\u30A4\u30D0\u30B7\u30FC\u30DD\u30EA\u30B7\u30FC"),
            react_1.default.createElement(Item, { href: "https://smarthr.co.jp" }, "\u904B\u55B6\u4F1A\u793E"),
            react_1.default.createElement(Item, { href: "https://developer.smarthr.jp" }, "\u958B\u767A\u8005\u5411\u3051API ")),
        react_1.default.createElement(Copy, { themes: theme }, "\u00A9 SmartHR, Inc.")));
};
exports.Footer = Footer;
const Wrapper = styled_components_1.default.footer `
  ${({ themes: { color, fontSize, spacingByChar } }) => (0, styled_components_1.css) `
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: ${spacingByChar(1)} ${spacingByChar(1.5)};
    background-color: ${color.BRAND};
    color: ${color.TEXT_WHITE};
    font-size: ${fontSize.M};
  `}
`;
const List = styled_components_1.default.ul `
  ${({ themes: { spacingByChar } }) => (0, styled_components_1.css) `
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin: 0;
    padding: 0;
    list-style: none;

    > li {
      padding: 3px 0;
      margin-right: ${spacingByChar(0.5)};
    }
  `}
`;
const Item = ({ children, href, className = '' }) => {
    const theme = (0, useTheme_1.useTheme)();
    return (react_1.default.createElement("li", { className: className },
        react_1.default.createElement(ItemAnchor, { themes: theme, target: "_blank", rel: "noopener noreferrer", href: href }, children)));
};
const ItemAnchor = styled_components_1.default.a `
  color: ${({ themes }) => themes.color.TEXT_WHITE};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
const Copy = styled_components_1.default.small `
  ${({ themes }) => (0, styled_components_1.css) `
    margin-left: auto;
    font-size: ${themes.fontSize.M};
  `}
`;
//# sourceMappingURL=Footer.js.map