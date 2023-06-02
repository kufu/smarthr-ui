"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dialog = void 0;
const react_1 = __importDefault(require("react"));
const DialogContentInner_1 = require("./DialogContentInner");
const useDialogPortal_1 = require("./useDialogPortal");
const Dialog = ({ children, className = '', portalParent, ...props }) => {
    const { createPortal } = (0, useDialogPortal_1.useDialogPortal)(portalParent);
    return createPortal(react_1.default.createElement(DialogContentInner_1.DialogContentInner, { ...props, className: className }, children));
};
exports.Dialog = Dialog;
//# sourceMappingURL=Dialog.js.map