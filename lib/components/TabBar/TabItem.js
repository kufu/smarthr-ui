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
exports.TabItem = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const ua_1 = require("../../libs/ua");
const useClassNames_1 = require("./useClassNames");
const TabItem = ({ id, children, onClick, selected = false, className = '', disabled = false, ...props }) => {
    const theme = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useClassNames)().tabItem;
    const wrapperClass = `${className} ${selected ? 'selected' : ''} ${classNames.wrapper}`;
    return (react_1.default.createElement(ItemButton, { ...props, role: "tab", "aria-selected": selected, className: wrapperClass, onClick: () => onClick(id), disabled: disabled, themes: theme, type: "button" }, children));
};
exports.TabItem = TabItem;
const resetButtonStyle = (0, styled_components_1.css) `
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  appearance: none;
`;
const ItemButton = styled_components_1.default.button `
  ${resetButtonStyle}
  ${({ themes }) => {
    const { fontSize, spacingByChar, color, interaction } = themes;
    return (0, styled_components_1.css) `
      font-weight: bold;
      font-size: ${fontSize.M};
      color: ${color.TEXT_GREY};
      height: 40px;
      border-bottom: solid 3px transparent;
      padding: 0 ${spacingByChar(1.5)};
      box-sizing: border-box;
      transition: ${ua_1.isTouchDevice
        ? 'none'
        : `background-color ${interaction.hover.animation}, color ${interaction.hover.animation}`};

      &.selected {
        position: relative;
        color: ${color.TEXT_BLACK};
        border-color: ${color.MAIN};
      }

      :hover {
        background-color: ${color.COLUMN};
        color: ${color.TEXT_BLACK};
      }

      :disabled {
        background-color: transparent;
        color: ${color.disableColor(color.TEXT_GREY)};
        cursor: not-allowed;
      }
    `;
}}
`;
//# sourceMappingURL=TabItem.js.map