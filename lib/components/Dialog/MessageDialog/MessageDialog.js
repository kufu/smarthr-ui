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
exports.MessageDialog = void 0;
const react_1 = __importStar(require("react"));
const useId_1 = require("../../../hooks/useId");
const DialogContentInner_1 = require("../DialogContentInner");
const useDialogPortal_1 = require("../useDialogPortal");
const MessageDialogContentInner_1 = require("./MessageDialogContentInner");
const MessageDialog = ({ title, subtitle, titleTag, description, onClickClose, onPressEscape = onClickClose, className = '', portalParent, decorators, ...props }) => {
    const { createPortal } = (0, useDialogPortal_1.useDialogPortal)(portalParent);
    const handleClickClose = (0, react_1.useCallback)(() => {
        if (!props.isOpen) {
            return;
        }
        onClickClose();
    }, [onClickClose, props.isOpen]);
    const titleId = (0, useId_1.useId)();
    return createPortal(react_1.default.createElement(DialogContentInner_1.DialogContentInner, { ...props, "aria-labelledby": titleId, className: className, onPressEscape: onPressEscape },
        react_1.default.createElement(MessageDialogContentInner_1.MessageDialogContentInner, { title: title, titleId: titleId, subtitle: subtitle, description: description, onClickClose: handleClickClose, decorators: decorators })));
};
exports.MessageDialog = MessageDialog;
//# sourceMappingURL=MessageDialog.js.map