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
exports.DialogContent = exports.DialogContentContext = void 0;
const react_1 = __importStar(require("react"));
const DialogContentInner_1 = require("./DialogContentInner");
const DialogWrapper_1 = require("./DialogWrapper");
const useDialogPortal_1 = require("./useDialogPortal");
exports.DialogContentContext = (0, react_1.createContext)({
    onClickClose: () => {
        /* noop */
    },
});
const DialogContent = ({ portalParent, children, ...props }) => {
    const { onClickClose, active } = (0, react_1.useContext)(DialogWrapper_1.DialogContext);
    const { createPortal } = (0, useDialogPortal_1.useDialogPortal)(portalParent);
    return createPortal(react_1.default.createElement(exports.DialogContentContext.Provider, { value: { onClickClose } },
        react_1.default.createElement(DialogContentInner_1.DialogContentInner, { ...props, isOpen: active, onClickOverlay: onClickClose, onPressEscape: onClickClose }, children)));
};
exports.DialogContent = DialogContent;
//# sourceMappingURL=DialogContent.js.map