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
exports.SideMenuItem = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../../hooks/useTheme");
const useClassNames_1 = require("./useClassNames");
const SideMenuItem = ({ href, children, current, className, ...props }) => {
    const theme = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useClassNames)();
    return (react_1.default.createElement(Item, { ...props, current: current, className: `${className || ''} ${classNames.item}`, themes: theme },
        react_1.default.createElement("a", { href: href, "aria-current": current && 'page' }, children)));
};
exports.SideMenuItem = SideMenuItem;
const Item = styled_components_1.default.li `
  ${({ current, themes: { color, radius, shadow, space } }) => (0, styled_components_1.css) `
    position: relative;
    padding-inline-start: ${space(0.75)};

    ${current &&
    (0, styled_components_1.css) `
      &::before {
        content: '';
        position: absolute;
        inset-block: 0;
        inset-inline-start: 0;
        display: block;
        width: 3px;
        background-color: ${color.MAIN};
      }
    `}

    a {
      /* 親要素ではなくリンクにスタイリングするため block でいっぱいに広げている */
      display: block;
      border-radius: ${radius.m};
      padding: ${space(0.75)} ${space(1)};
      text-decoration: unset;

      &[aria-current='page'] {
        background-color: ${color.GREY_9};
        font-weight: bold;
      }

      &:hover {
        background-color: ${color.hoverColor(color.GREY_9)};
      }

      &:focus-visible {
        /* フォーカスリングを前に出したいので、スタッキングコンテキストを発生させている */
        position: relative;
        z-index: 1;
        ${shadow.focusIndicatorStyles}
      }
    }
  `}
`;
//# sourceMappingURL=SideMenuItem.js.map