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
exports.MultiSelectedItem = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const Button_1 = require("../Button");
const Icon_1 = require("../Icon");
const MultiSelectedItemTooltip_1 = require("./MultiSelectedItemTooltip");
const useClassNames_1 = require("./useClassNames");
const DESTROY_BUTTON_TEXT = '削除';
function MultiSelectedItem({ item, disabled, onDelete, enableEllipsis, buttonRef, decorators, }) {
    const theme = (0, useTheme_1.useTheme)();
    const labelRef = (0, react_1.useRef)(null);
    const [needsTooltip, setNeedsTooltip] = (0, react_1.useState)(false);
    const { deletable = true } = item;
    (0, react_1.useEffect)(() => {
        const elem = labelRef.current;
        if (!elem || !enableEllipsis) {
            return;
        }
        if (elem.offsetWidth < elem.scrollWidth) {
            setNeedsTooltip(true);
        }
    }, [enableEllipsis]);
    const classNames = (0, useClassNames_1.useMultiComboBoxClassNames)();
    return (react_1.default.createElement(MultiSelectedItemTooltip_1.MultiSelectedItemTooltip, { needsTooltip: needsTooltip, text: item.label },
        react_1.default.createElement(Wrapper, { themes: theme, disabled: disabled, className: classNames.selectedItem },
            react_1.default.createElement(ItemLabel, { themes: theme, enableEllipsis: enableEllipsis, className: classNames.selectedItemLabel, ref: labelRef }, item.label),
            deletable && (react_1.default.createElement(DeleteButton, { type: "button", themes: theme, className: classNames.deleteButton, disabled: disabled, onClick: () => {
                    onDelete && onDelete(item);
                }, onKeyDown: (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.stopPropagation();
                    }
                }, ref: buttonRef, tabIndex: -1 },
                react_1.default.createElement(Icon_1.FaTimesCircleIcon, { size: 11, color: "inherit", alt: decorators?.destroyButtonIconAlt?.(DESTROY_BUTTON_TEXT) || DESTROY_BUTTON_TEXT }))))));
}
exports.MultiSelectedItem = MultiSelectedItem;
const Wrapper = styled_components_1.default.div `
  ${({ themes, disabled }) => {
    const { border, color, fontSize } = themes;
    return (0, styled_components_1.css) `
      position: relative;
      display: flex;
      border-radius: 1em;
      border: ${border.shorthand};
      background-color: ${disabled ? color.disableColor(color.WHITE) : color.WHITE};
      color: ${disabled ? color.TEXT_DISABLED : color.TEXT_BLACK};
      font-size: ${fontSize.S};
    `;
}}
`;
const ItemLabel = styled_components_1.default.div `
  ${({ enableEllipsis, themes: { border, spacingByChar } }) => {
    return (0, styled_components_1.css) `
      padding: ${spacingByChar(0.25)} calc(${spacingByChar(0.5)} - ${border.lineWidth});

      ${enableEllipsis &&
        (0, styled_components_1.css) `
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `}
    `;
}}
`;
const DeleteButton = (0, styled_components_1.default)(Button_1.UnstyledButton) `
  ${({ themes: { border, spacingByChar, shadow }, disabled }) => {
    return (0, styled_components_1.css) `
      flex-shrink: 1;
      padding: calc(${spacingByChar(0.5)} - ${border.lineWidth});
      border-radius: 50%;
      cursor: ${disabled ? 'not-allowed' : 'pointer'};
      line-height: 0;

      &:focus-visible {
        box-shadow: unset;
      }

      &:focus-visible > svg {
        border-radius: 50%;
        ${shadow.focusIndicatorStyles};
      }
    `;
}}
`;
//# sourceMappingURL=MultiSelectedItem.js.map