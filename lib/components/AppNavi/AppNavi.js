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
exports.AppNavi = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const StatusLabel_1 = require("../StatusLabel");
const AppNaviAnchor_1 = require("./AppNaviAnchor");
const AppNaviButton_1 = require("./AppNaviButton");
const AppNaviCustomTag_1 = require("./AppNaviCustomTag");
const AppNaviDropdown_1 = require("./AppNaviDropdown");
const useClassNames_1 = require("./useClassNames");
const AppNavi = ({ label, buttons, isCurrentUnclickable, className = '', children = null, displayDropdownCaret = false, ...props }) => {
    const theme = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useClassNames)();
    return (react_1.default.createElement(Wrapper, { ...props, themes: theme, className: `${className} ${classNames.wrapper}` },
        label && (react_1.default.createElement(StatusLabel, { themes: theme, className: classNames.label }, label)),
        buttons && (react_1.default.createElement(Buttons, { themes: theme, className: classNames.buttons }, buttons.map((button, i) => {
            const isUnclickable = button.current && isCurrentUnclickable;
            if ('tag' in button) {
                const { tag, icon, current, children: buttonChildren, ...buttonProps } = button;
                return (react_1.default.createElement("li", { key: i, className: classNames.listItem },
                    react_1.default.createElement(AppNaviCustomTag_1.AppNaviCustomTag, { ...buttonProps, tag: tag, icon: icon, current: current, isUnclickable: isUnclickable }, buttonChildren)));
            }
            if ('href' in button) {
                return (react_1.default.createElement("li", { key: i, className: classNames.listItem },
                    react_1.default.createElement(AppNaviAnchor_1.AppNaviAnchor, { href: button.href, icon: button.icon, current: button.current, isUnclickable: isUnclickable }, button.children)));
            }
            if ('dropdownContent' in button) {
                return (react_1.default.createElement("li", { key: i, className: classNames.listItem },
                    react_1.default.createElement(AppNaviDropdown_1.AppNaviDropdown, { dropdownContent: button.dropdownContent, icon: button.icon, current: button.current, isUnclickable: isUnclickable, displayCaret: displayDropdownCaret }, button.children)));
            }
            return (react_1.default.createElement("li", { key: i, className: classNames.listItem },
                react_1.default.createElement(AppNaviButton_1.AppNaviButton, { icon: button.icon, current: button.current, onClick: button.onClick, isUnclickable: isUnclickable }, button.children)));
        }))),
        children));
};
exports.AppNavi = AppNavi;
const Wrapper = styled_components_1.default.nav `
  ${({ themes: { color, shadow, spacingByChar } }) => {
    return (0, styled_components_1.css) `
      display: flex;
      align-items: center;
      min-width: max-content;
      box-shadow: ${shadow.LAYER1};
      background-color: ${color.WHITE};
      padding-right: ${spacingByChar(1.5)};
      padding-left: ${spacingByChar(1.5)};
    `;
}}
`;
const StatusLabel = (0, styled_components_1.default)(StatusLabel_1.StatusLabel) `
  ${({ themes: { spacingByChar } }) => {
    return (0, styled_components_1.css) `
      margin-right: ${spacingByChar(1)};
    `;
}}
`;
const Buttons = styled_components_1.default.ul `
  ${({ themes: { spacingByChar } }) => {
    return (0, styled_components_1.css) `
      align-self: stretch;
      display: flex;
      align-items: stretch;
      gap: ${spacingByChar(1)};
      margin: 0;
      padding: 0;

      > li {
        list-style: none;
      }
    `;
}}
`;
//# sourceMappingURL=AppNavi.js.map