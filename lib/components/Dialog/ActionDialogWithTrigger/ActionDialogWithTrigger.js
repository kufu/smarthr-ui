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
exports.ActionDialogWithTrigger = void 0;
const react_1 = __importStar(require("react"));
const useId_1 = require("../../../hooks/useId");
const ActionDialog_1 = require("../ActionDialog");
const ActionDialogWithTrigger = ({ id, trigger, onClickTrigger, onClickClose, ...props }) => {
    const generatedId = (0, useId_1.useId)();
    const actualId = id || generatedId;
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const open = (0, react_1.useCallback)(() => setIsOpen(true), []);
    const close = (0, react_1.useCallback)(() => setIsOpen(false), []);
    const onClickOpen = (0, react_1.useCallback)(() => {
        if (onClickTrigger) {
            return onClickTrigger(open);
        }
        open();
    }, [onClickTrigger, open]);
    const actualOnClickClose = (0, react_1.useCallback)(() => {
        if (onClickClose) {
            return onClickClose(close);
        }
        close();
    }, [onClickClose, close]);
    const actualTrigger = (0, react_1.useMemo)(() => (0, react_1.cloneElement)(trigger, {
        onClick: onClickOpen,
        'aria-haspopup': 'true',
        'aria-controls': actualId,
    }), [trigger, actualId, onClickOpen]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        actualTrigger,
        react_1.default.createElement(ActionDialog_1.ActionDialog, { ...props, isOpen: isOpen, onClickClose: actualOnClickClose, id: actualId })));
};
exports.ActionDialogWithTrigger = ActionDialogWithTrigger;
//# sourceMappingURL=ActionDialogWithTrigger.js.map