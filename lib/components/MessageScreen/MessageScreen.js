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
exports.MessageScreen = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const Heading_1 = require("../Heading");
const Layout_1 = require("../Layout");
const SmartHRLogo_1 = require("../SmartHRLogo");
const TextLink_1 = require("../TextLink");
const useClassNames_1 = require("./useClassNames");
const MessageScreen = ({ logo = react_1.default.createElement(SmartHRLogo_1.SmartHRLogo, { fill: "brand" }), title, links, children, footer, className = '', ...props }) => {
    const theme = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useClassNames)();
    return (react_1.default.createElement(Wrapper, { ...props, themes: theme, className: `${className} ${classNames.wrapper}` },
        react_1.default.createElement(Box, null,
            react_1.default.createElement(Logo, { className: classNames.logo }, logo),
            react_1.default.createElement(Layout_1.Stack, { align: "center" },
                title && react_1.default.createElement(Heading_1.Heading, { className: classNames.title }, title),
                children && react_1.default.createElement(Content, { className: classNames.content }, children),
                links?.length && (react_1.default.createElement(Links, { className: classNames.linkList }, links.map((link, index) => (react_1.default.createElement("li", { key: index },
                    react_1.default.createElement(TextLink_1.TextLink, { ...(link.target ? { target: link.target } : {}), href: link.url, className: classNames.link }, link.label)))))))),
        footer && react_1.default.createElement(FooterArea, { className: classNames.footer }, footer)));
};
exports.MessageScreen = MessageScreen;
const Wrapper = (0, styled_components_1.default)(Layout_1.Center).attrs({ minHeight: '100vh', verticalCentering: true }) `
  ${({ themes }) => {
    const { color } = themes;
    return (0, styled_components_1.css) `
      background-color: ${color.BACKGROUND};
    `;
}}
`;
const Box = (0, styled_components_1.default)(Layout_1.Stack).attrs({ gap: 1.5, align: 'center' }) `
  margin-block: auto;
`;
const Logo = styled_components_1.default.div ``;
const Content = styled_components_1.default.div ``;
const Links = (0, styled_components_1.default)(Layout_1.Stack).attrs({ as: 'ul', gap: 0.5, align: 'center' }) ``;
const FooterArea = styled_components_1.default.div `
  align-self: stretch;
`;
//# sourceMappingURL=MessageScreen.js.map