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
exports.ActionDialog = void 0;
const react_1 = __importStar(require("react"));
const useId_1 = require("../../../hooks/useId");
const DialogContentInner_1 = require("../DialogContentInner");
const useDialogPortal_1 = require("../useDialogPortal");
const ActionDialogContentInner_1 = require("./ActionDialogContentInner");
const ActionDialog = ({ children, title, subtitle, titleTag, actionText, actionTheme, onClickAction, onClickClose, onPressEscape = onClickClose, responseMessage, actionDisabled = false, closeDisabled, className = '', portalParent, decorators, ...props }) => {
    const { createPortal } = (0, useDialogPortal_1.useDialogPortal)(portalParent);
    const titleId = (0, useId_1.useId)();
    const handleClickClose = (0, react_1.useCallback)(() => {
        if (!props.isOpen) {
            return;
        }
        onClickClose();
    }, [onClickClose, props.isOpen]);
    const handleClickAction = (0, react_1.useCallback)(() => {
        if (!props.isOpen) {
            return;
        }
        onClickAction(onClickClose);
    }, [onClickAction, onClickClose, props.isOpen]);
    return createPortal(react_1.default.createElement(DialogContentInner_1.DialogContentInner, { ...props, ariaLabelledby: titleId, className: className, onPressEscape: onPressEscape },
        react_1.default.createElement(ActionDialogContentInner_1.ActionDialogContentInner, { title: title, titleId: titleId, subtitle: subtitle, titleTag: titleTag, actionText: actionText, actionTheme: actionTheme, actionDisabled: actionDisabled, closeDisabled: closeDisabled, onClickClose: handleClickClose, onClickAction: handleClickAction, responseMessage: responseMessage, decorators: decorators }, children)));
};
exports.ActionDialog = ActionDialog;
//# sourceMappingURL=ActionDialog.js.map