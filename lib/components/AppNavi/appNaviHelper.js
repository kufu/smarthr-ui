"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItemStyle = exports.getIconComponent = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = require("styled-components");
const getIconComponent = (theme, options) => {
    const opts = {
        icon: null,
        current: false,
        ...options,
    };
    const { TEXT_BLACK, TEXT_GREY } = theme.color;
    if (!opts.icon)
        return null;
    const Icon = opts.icon;
    const iconProps = {
        color: opts.current ? TEXT_BLACK : TEXT_GREY,
    };
    return react_1.default.createElement(Icon, { ...iconProps });
};
exports.getIconComponent = getIconComponent;
const getItemStyle = ({ themes: { color: { hoverColor, MAIN, TEXT_BLACK, TEXT_GREY, WHITE }, fontSize, leading, spacingByChar, }, isActive, isUnclickable, }) => (0, styled_components_1.css) `
    display: flex;
    align-items: center;
    gap: ${spacingByChar(0.5)};
    height: 100%;
    box-sizing: border-box;
    margin: 0;
    border: none;
    background-color: transparent;
    padding: ${spacingByChar(0.75)} ${spacingByChar(0.5)};
    text-decoration: none;
    font-size: ${fontSize.M};
    font-weight: bold;
    line-height: ${leading.NONE};
    color: ${TEXT_GREY};
    white-space: nowrap;

    ${isActive &&
    (0, styled_components_1.css) `
      color: ${TEXT_BLACK};
      position: relative;
      &::after {
        content: '';
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        display: block;
        background-color: ${MAIN};
        height: ${spacingByChar(0.25)};
      }
    `}
    ${!isUnclickable &&
    (0, styled_components_1.css) `
      cursor: pointer;
      &:hover {
        background-color: ${hoverColor(WHITE)};
      }
    `}
  `;
exports.getItemStyle = getItemStyle;
//# sourceMappingURL=appNaviHelper.js.map