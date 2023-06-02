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
exports.TextLink = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const Icon_1 = require("../Icon");
exports.TextLink = (0, react_1.forwardRef)(({ href, target, onClick, children, prefix, suffix, ...props }, ref) => {
    const theme = (0, useTheme_1.useTheme)();
    const actualSuffix = (0, react_1.useMemo)(() => {
        if (target === '_blank' && suffix === undefined) {
            return react_1.default.createElement(Icon_1.FaExternalLinkAltIcon, { "aria-label": "\u5225\u30BF\u30D6\u3067\u958B\u304F" });
        }
        return suffix;
    }, [suffix, target]);
    const actualHref = (0, react_1.useMemo)(() => {
        if (href) {
            return href;
        }
        if (onClick) {
            return '';
        }
        return undefined;
    }, [href, onClick]);
    const actualOnClick = (0, react_1.useMemo)(() => {
        if (!onClick) {
            return undefined;
        }
        return (e) => {
            if (!href) {
                e.preventDefault();
            }
            onClick(e);
        };
    }, [href, onClick]);
    return (react_1.default.createElement(StyledAnchor, { ...props, ref: ref, href: actualHref, target: target, onClick: actualOnClick, themes: theme },
        prefix && react_1.default.createElement(PrefixWrapper, { themes: theme }, prefix),
        children,
        actualSuffix && react_1.default.createElement(SuffixWrapper, { themes: theme }, actualSuffix)));
});
const StyledAnchor = styled_components_1.default.a `
  ${({ themes }) => {
    const { color } = themes;
    return (0, styled_components_1.css) `
      text-decoration: none;
      box-shadow: 0 1px 0 0;
      color: ${color.TEXT_LINK};

      &:hover {
        color: ${color.hoverColor(color.TEXT_LINK)};
      }

      &:not([href]) {
        box-shadow: none;
      }
    `;
}}
`;
const PrefixWrapper = styled_components_1.default.span(({ themes: { spacingByChar } }) => (0, styled_components_1.css) `
    margin-right: ${spacingByChar(0.25)};
    vertical-align: middle;
  `);
const SuffixWrapper = styled_components_1.default.span(({ themes: { spacingByChar } }) => (0, styled_components_1.css) `
    margin-left: ${spacingByChar(0.25)};
    vertical-align: middle;
  `);
//# sourceMappingURL=TextLink.js.map