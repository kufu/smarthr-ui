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
exports.ListBoxItem = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const Icon_1 = require("../Icon");
const ComboBoxContext_1 = require("./ComboBoxContext");
function ListBoxItem({ option, isActive, onAdd, onSelect, onMouseOver, activeRef }) {
    const className = isActive ? 'active' : '';
    const { item, selected, isNew } = option;
    const { label, disabled } = item;
    const handleAdd = (0, react_1.useCallback)(() => {
        onAdd(option);
    }, [onAdd, option]);
    const handleSelect = (0, react_1.useCallback)(() => {
        onSelect(option);
    }, [onSelect, option]);
    const handleMouseOver = (0, react_1.useCallback)(() => {
        onMouseOver(option);
    }, [onMouseOver, option]);
    const theme = (0, useTheme_1.useTheme)();
    const { listBoxClassNames: classNames } = (0, react_1.useContext)(ComboBoxContext_1.ComboBoxContext);
    return isNew ? (react_1.default.createElement(AddButton, { key: option.id, themes: theme, onClick: handleAdd, onMouseOver: handleMouseOver, id: option.id, role: "option", className: `${className} ${classNames.addButton}`, ref: isActive ? activeRef : undefined },
        react_1.default.createElement(AddIcon, { color: theme.color.TEXT_LINK, themes: theme }),
        react_1.default.createElement(AddText, { themes: theme },
            "\u300C",
            label,
            "\u300D\u3092\u8FFD\u52A0"))) : (react_1.default.createElement(SelectButton, { key: option.id, type: "button", themes: theme, disabled: disabled, onClick: handleSelect, onMouseOver: handleMouseOver, id: option.id, role: "option", className: `${className} ${classNames.selectButton}`, "aria-selected": selected, ref: isActive ? activeRef : undefined }, label));
}
const typedMemo = react_1.default.memo;
const Memoized = typedMemo(ListBoxItem);
exports.ListBoxItem = Memoized;
const SelectButton = styled_components_1.default.button `
  ${({ themes }) => {
    const { fontSize, leading, spacingByChar, color } = themes;
    return (0, styled_components_1.css) `
      display: block;
      min-width: 100%;
      border: none;
      padding: ${spacingByChar(0.5)} ${spacingByChar(1)};
      background-color: ${color.WHITE};
      font-size: ${fontSize.M};
      line-height: ${leading.TIGHT};
      text-align: left;
      cursor: pointer;

      &.active {
        background-color: ${color.hoverColor(color.WHITE)};
        color: inherit;
      }

      &[aria-selected='true'] {
        background-color: ${color.MAIN};
        color: ${color.TEXT_WHITE};
        &.active {
          background-color: ${color.hoverColor(color.MAIN)};
        }
      }

      &[disabled] {
        color: ${color.TEXT_DISABLED};
        cursor: not-allowed;
      }
    `;
}}
`;
const AddButton = (0, styled_components_1.default)(SelectButton) `
  display: flex;
  align-items: center;
  min-width: 100%;
`;
const AddIcon = (0, styled_components_1.default)(Icon_1.FaPlusCircleIcon) `
  ${({ themes }) => {
    const { spacingByChar } = themes;
    return (0, styled_components_1.css) `
      position: relative;
      top: -1px;
      margin-right: ${spacingByChar(0.25)};
    `;
}}
`;
const AddText = styled_components_1.default.span `
  ${({ themes }) => {
    const { color } = themes;
    return (0, styled_components_1.css) `
      color: ${color.TEXT_LINK};
    `;
}}
`;
//# sourceMappingURL=ListBoxItem.js.map