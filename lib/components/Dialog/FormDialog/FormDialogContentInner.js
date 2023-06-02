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
exports.FormDialogContentInner = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../../hooks/useTheme");
const Button_1 = require("../../Button");
const Icon_1 = require("../../Icon");
const Layout_1 = require("../../Layout");
const Text_1 = require("../../Text");
const dialogHelper_1 = require("../dialogHelper");
const useClassNames_1 = require("../useClassNames");
const CLOSE_BUTTON_LABEL = 'キャンセル';
const FormDialogContentInner = ({ children, title, titleId, subtitle, titleTag = 'h2', actionText, actionTheme = 'primary', onSubmit, onClickClose, responseMessage, actionDisabled = false, closeDisabled, decorators, }) => {
    const classNames = (0, useClassNames_1.useClassNames)().dialog;
    const theme = (0, useTheme_1.useTheme)();
    const handleSubmitAction = (0, react_1.useCallback)(() => {
        onSubmit(onClickClose);
    }, [onSubmit, onClickClose]);
    const { offsetHeight, titleRef, bottomRef } = (0, dialogHelper_1.useOffsetHeight)();
    const isRequestProcessing = responseMessage && responseMessage.status === 'processing';
    return (react_1.default.createElement("form", { onSubmit: handleSubmitAction },
        react_1.default.createElement(TitleArea, { gap: 0.25, themes: theme, ref: titleRef, className: classNames.titleArea, as: titleTag },
            subtitle && (react_1.default.createElement(Text_1.Text, { size: "S", leading: "TIGHT", color: "TEXT_GREY", className: classNames.subtitle }, subtitle)),
            react_1.default.createElement(Text_1.Text, { id: titleId, size: "L", leading: "TIGHT", className: classNames.title }, title)),
        react_1.default.createElement(Body, { offsetHeight: offsetHeight, className: classNames.body }, children),
        react_1.default.createElement(ActionArea, { themes: theme, ref: bottomRef, className: classNames.actionArea },
            react_1.default.createElement(ButtonArea, { className: classNames.buttonArea },
                react_1.default.createElement(Button_1.Button, { onClick: onClickClose, disabled: closeDisabled || isRequestProcessing, className: classNames.closeButton }, decorators?.closeButtonLabel?.(CLOSE_BUTTON_LABEL) || CLOSE_BUTTON_LABEL),
                react_1.default.createElement(Button_1.Button, { type: "submit", variant: actionTheme, disabled: actionDisabled, loading: isRequestProcessing, className: classNames.actionButton }, actionText)),
            responseMessage && (react_1.default.createElement(react_1.default.Fragment, null,
                responseMessage.status === 'success' && (react_1.default.createElement(Message, null,
                    react_1.default.createElement(Icon_1.FaCheckCircleIcon, { color: theme.color.MAIN, text: responseMessage.text, role: "alert" }))),
                responseMessage.status === 'error' && (react_1.default.createElement(Message, null,
                    react_1.default.createElement(Icon_1.FaExclamationCircleIcon, { color: theme.color.DANGER, text: responseMessage.text, role: "alert" }))))))));
};
exports.FormDialogContentInner = FormDialogContentInner;
const TitleArea = (0, styled_components_1.default)(Layout_1.Stack) `
  ${({ themes: { border, space } }) => (0, styled_components_1.css) `
    margin-block: unset;
    border-bottom: ${border.shorthand};
    padding: ${space(1)} ${space(1.5)};
  `}
`;
const Body = styled_components_1.default.div `
  ${({ offsetHeight }) => (0, styled_components_1.css) `
    max-height: calc(100vh - ${offsetHeight}px);
    overflow: auto;
  `}
`;
const ActionArea = (0, styled_components_1.default)(Layout_1.Stack).attrs({ gap: 0.5 }) `
  ${({ themes: { space, border } }) => (0, styled_components_1.css) `
    border-top: ${border.shorthand};
    padding: ${space(1)} ${space(1.5)};
  `}
`;
const ButtonArea = (0, styled_components_1.default)(Layout_1.Cluster).attrs({ gap: { row: 0.5, column: 1 }, justify: 'flex-end' }) ``;
const Message = styled_components_1.default.div `
  text-align: right;
`;
//# sourceMappingURL=FormDialogContentInner.js.map