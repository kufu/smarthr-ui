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
exports.SideNavItem = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const ua_1 = require("../../libs/ua");
const Button_1 = require("../Button");
const useClassNames_1 = require("./useClassNames");
const SideNavItem = ({ id, title, prefix, isSelected = false, size, onClick, }) => {
    const theme = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useClassNames)();
    const handleClick = onClick
        ? (e) => onClick(e, id)
        : undefined;
    const itemClassName = `${isSelected ? 'selected' : ''} ${classNames.item}`;
    return (react_1.default.createElement(Wrapper, { className: itemClassName, themes: theme },
        react_1.default.createElement(Button, { className: size, themes: theme, onClick: handleClick },
            prefix && react_1.default.createElement(PrefixWrapper, { themes: theme }, prefix),
            react_1.default.createElement("span", { className: classNames.itemTitle }, title))));
};
exports.SideNavItem = SideNavItem;
const Wrapper = styled_components_1.default.li `
  ${({ themes }) => {
    const { color, interaction } = themes;
    return (0, styled_components_1.css) `
      color: ${color.TEXT_BLACK};
      transition: ${ua_1.isTouchDevice
        ? 'none'
        : `background-color ${interaction.hover.animation}, color ${interaction.hover.animation}`};

      &:hover {
        background-color: ${color.hoverColor(color.COLUMN)};
      }

      &.selected {
        background-color: ${color.MAIN};
        color: ${color.TEXT_WHITE};
        position: relative;

        &::after {
          position: absolute;
          top: 50%;
          right: -4px;
          transform: translate(0, -50%);
          border-style: solid;
          border-width: 4px 0 4px 4px;
          border-color: transparent transparent transparent ${color.MAIN};
          content: '';
        }
      }
    `;
}}
`;
const Button = (0, styled_components_1.default)(Button_1.UnstyledButton) `
  ${({ themes }) => {
    const { fontSize, shadow, spacingByChar } = themes;
    return (0, styled_components_1.css) `
      outline: none;
      width: 100%;
      line-height: 1;
      box-sizing: border-box;
      cursor: pointer;

      &.default {
        padding: ${spacingByChar(1)};
        font-size: ${fontSize.M};
      }

      &.s {
        padding: ${spacingByChar(0.5)} ${spacingByChar(1)};
        font-size: ${fontSize.S};
      }

      &:focus-visible {
        ${shadow.focusIndicatorStyles}
      }
    `;
}}
`;
const PrefixWrapper = styled_components_1.default.span `
  ${({ themes: { spacingByChar } }) => {
    return (0, styled_components_1.css) `
      margin-right: ${spacingByChar(0.5)};
    `;
}}
`;
//# sourceMappingURL=SideNavItem.js.map