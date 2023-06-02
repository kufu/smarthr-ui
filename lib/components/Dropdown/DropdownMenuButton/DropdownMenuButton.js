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
exports.DropdownMenuButton = void 0;
const react_1 = __importStar(require("react"));
const react_innertext_1 = __importDefault(require("react-innertext"));
const styled_components_1 = __importStar(require("styled-components"));
const __1 = require("..");
const useTheme_1 = require("../../../hooks/useTheme");
const Button_1 = require("../../Button");
const Icon_1 = require("../../Icon");
const Layout_1 = require("../../Layout");
const useClassNames_1 = require("./useClassNames");
const DropdownMenuButton = ({ label, children, triggerSize, onlyIconTrigger = false, className = '', ...props }) => {
    const themes = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useClassNames)();
    const triggerLabel = (0, react_1.useMemo)(() => onlyIconTrigger ? (react_1.default.createElement(Icon_1.FaEllipsisHIcon, { alt: typeof label === 'string' ? label : (0, react_innertext_1.default)(label) })) : (label), [onlyIconTrigger, label]);
    const triggerSuffix = (0, react_1.useMemo)(
    // eslint-disable-next-line react/jsx-no-useless-fragment
    () => (onlyIconTrigger ? react_1.default.createElement(react_1.default.Fragment, null) : react_1.default.createElement(Icon_1.FaCaretDownIcon, { alt: "\u5019\u88DC\u3092\u958B\u304F" })), [onlyIconTrigger]);
    return (react_1.default.createElement(__1.Dropdown, null,
        react_1.default.createElement(__1.DropdownTrigger, { className: `${classNames.wrapper}${className && ` ${className}`}` },
            react_1.default.createElement(TriggerButton, { ...props, suffix: triggerSuffix, size: triggerSize, square: onlyIconTrigger, className: classNames.trigger }, triggerLabel)),
        react_1.default.createElement(__1.DropdownContent, null,
            react_1.default.createElement(__1.DropdownScrollArea, null,
                react_1.default.createElement(ActionList, { themes: themes, className: classNames.panel }, react_1.default.Children.map(children, (item, i) => 
                // MEMO: {flag && <Button/>}のような書き方に対応させる為、型を変換する
                // itemの存在チェックでfalsyな値は弾かれている想定
                item ? react_1.default.createElement("li", { key: i }, actionItem(item)) : null))))));
};
exports.DropdownMenuButton = DropdownMenuButton;
const TriggerButton = (0, styled_components_1.default)(Button_1.Button) `
  &[aria-expanded='true'] .smarthr-ui-Icon:last-child {
    transform: rotate(0.5turn);
  }
`;
const ActionList = (0, styled_components_1.default)(Layout_1.Stack).attrs({ as: 'ul', gap: 0 }) `
  ${({ themes: { space } }) => (0, styled_components_1.css) `
    list-style: none;
    margin-block: 0;
    padding: ${space(0.5)} ${space(0.25)};

    .smarthr-ui-Button,
    .smarthr-ui-AnchorButton {
      width: 100%;
      border-style: none;
      justify-content: flex-start;

      padding-block: ${space(0.5)};
      font-weight: normal;
    }

    .smarthr-ui-Button-disabledWrapper {
      column-gap: ${space(0.5)};
      /* unset した Button の右 padding 分 */
      padding-inline-end: ${space(1)};

      > [disabled] {
        padding-inline-end: unset;
        width: unset;
      }
    }
  `}
`;
const actionItem = (item) => react_1.default.cloneElement(item, { variant: 'text', wide: true });
//# sourceMappingURL=DropdownMenuButton.js.map