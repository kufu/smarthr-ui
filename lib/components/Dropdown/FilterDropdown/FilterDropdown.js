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
exports.FilterDropdown = void 0;
const react_1 = __importStar(require("react"));
const react_innertext_1 = __importDefault(require("react-innertext"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../../hooks/useTheme");
const Button_1 = require("../../Button");
const Icon_1 = require("../../Icon");
const Layout_1 = require("../../Layout");
const Dropdown_1 = require("../Dropdown");
const DropdownCloser_1 = require("../DropdownCloser");
const DropdownContent_1 = require("../DropdownContent");
const DropdownScrollArea_1 = require("../DropdownScrollArea");
const DropdownTrigger_1 = require("../DropdownTrigger");
const STATUS_FILTERED_TEXT = '適用中';
const TRIGGER_BUTTON_TEXT = '絞り込み';
const APPLY_BUTTON_TEXT = '適用';
const CANCEL_BUTTON_TEXT = 'キャンセル';
const RESET_BUTTON_TEXT = '絞り込み条件を解除';
const executeDecorator = (defaultText, decorator) => decorator?.(defaultText) || defaultText;
const FilterDropdown = ({ isFiltered = false, onApply, onCancel, onReset, children, hasStatusText, decorators, responseMessage, ...props }) => {
    const themes = (0, useTheme_1.useTheme)();
    const status = (0, react_1.useMemo)(() => executeDecorator(STATUS_FILTERED_TEXT, decorators?.status), [decorators]);
    const triggerButton = (0, react_1.useMemo)(() => executeDecorator(TRIGGER_BUTTON_TEXT, decorators?.triggerButton), [decorators]);
    const applyButton = (0, react_1.useMemo)(() => executeDecorator(APPLY_BUTTON_TEXT, decorators?.applyButton), [decorators]);
    const cancelButton = (0, react_1.useMemo)(() => executeDecorator(CANCEL_BUTTON_TEXT, decorators?.cancelButton), [decorators]);
    const resetButton = (0, react_1.useMemo)(() => executeDecorator(RESET_BUTTON_TEXT, decorators?.resetButton), [decorators]);
    const filteredIconAriaLabel = (0, react_1.useMemo)(() => (hasStatusText ? undefined : (0, react_innertext_1.default)(status)), [status, hasStatusText]);
    const isRequestProcessing = responseMessage !== undefined && responseMessage.status === 'processing';
    return (react_1.default.createElement(Dropdown_1.Dropdown, null,
        react_1.default.createElement(DropdownTrigger_1.DropdownTrigger, null,
            react_1.default.createElement(Button_1.Button, { ...props, suffix: react_1.default.createElement(IsFilteredIconWrapper, { isFiltered: isFiltered, themes: themes },
                    react_1.default.createElement(Icon_1.FaFilterIcon, null),
                    isFiltered ? (react_1.default.createElement(Icon_1.FaCheckCircleIcon, { size: 8, "aria-label": filteredIconAriaLabel })) : null) }, triggerButton)),
        hasStatusText && isFiltered ? react_1.default.createElement(StatusText, { themes: themes }, status) : null,
        react_1.default.createElement(DropdownContent_1.DropdownContent, { controllable: true },
            react_1.default.createElement(DropdownScrollArea_1.DropdownScrollArea, null,
                react_1.default.createElement(ContentLayout, { themes: themes }, children)),
            react_1.default.createElement(ActionArea, { themes: themes },
                react_1.default.createElement(Layout_1.Cluster, { gap: 1, align: "center", justify: "space-between" },
                    onReset && (react_1.default.createElement(ResetButtonLayout, { themes: themes },
                        react_1.default.createElement(Button_1.Button, { variant: "text", size: "s", prefix: react_1.default.createElement(Icon_1.FaUndoAltIcon, null), onClick: onReset, disabled: isRequestProcessing }, resetButton))),
                    react_1.default.createElement(RightButtonLayout, null,
                        react_1.default.createElement(DropdownCloser_1.DropdownCloser, null,
                            react_1.default.createElement(Button_1.Button, { onClick: onCancel, disabled: isRequestProcessing }, cancelButton)),
                        react_1.default.createElement(DropdownCloser_1.DropdownCloser, null,
                            react_1.default.createElement(Button_1.Button, { variant: "primary", onClick: onApply, loading: isRequestProcessing }, applyButton)))),
                responseMessage?.status === 'success' && (react_1.default.createElement(Message, null,
                    react_1.default.createElement(Icon_1.FaCheckCircleIcon, { color: themes.color.MAIN, text: responseMessage.text, role: "alert" }))),
                responseMessage?.status === 'error' && (react_1.default.createElement(Message, null,
                    react_1.default.createElement(Icon_1.FaExclamationCircleIcon, { color: themes.color.DANGER, text: responseMessage.text, role: "alert" })))))));
};
exports.FilterDropdown = FilterDropdown;
const IsFilteredIconWrapper = styled_components_1.default.span `
  position: relative;
  color: ${({ isFiltered, themes }) => {
    return isFiltered ? themes.color.MAIN : themes.color.TEXT_BLACK;
}};
  line-height: 1;

  & > [role='img'] + [role='img'] {
    position: absolute;
    right: -4px;
    bottom: 2px;
  }
`;
const StatusText = styled_components_1.default.span `
  margin-left: ${({ themes }) => themes.spacing.XXS};
  font-size: ${({ themes }) => themes.fontSize.S};
`;
const ContentLayout = styled_components_1.default.div `
  ${({ themes: { space } }) => (0, styled_components_1.css) `
    padding: ${space(1.5)};
  `}
`;
const ActionArea = (0, styled_components_1.default)(Layout_1.Stack).attrs({ gap: 0.5 }) `
  ${({ themes: { space, border } }) => (0, styled_components_1.css) `
    border-block-start: ${border.shorthand};
    padding: ${space(1)} ${space(1.5)};
  `}
`;
const ResetButtonLayout = styled_components_1.default.div `
  ${({ themes: { space } }) => (0, styled_components_1.css) `
    margin-inline-start: ${space(-0.5)};
  `}
`;
const RightButtonLayout = (0, styled_components_1.default)(Layout_1.Cluster).attrs({
    gap: { column: 1, row: 0.5 },
    justify: 'flex-end',
}) `
  margin-inline-start: auto;
`;
const Message = styled_components_1.default.div `
  text-align: right;
`;
//# sourceMappingURL=FilterDropdown.js.map