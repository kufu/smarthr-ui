"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteTriggerFormDialog = void 0;
const react_1 = __importDefault(require("react"));
const FormDialog_1 = require("../FormDialog");
const useRemoteTrigger_1 = require("../useRemoteTrigger");
const RemoteTriggerFormDialog = ({ id, onClickClose, ...props }) => {
    const { isOpen, onClickClose: actualOnClickClose } = (0, useRemoteTrigger_1.useRemoteTrigger)({ id, onClickClose });
    return react_1.default.createElement(FormDialog_1.FormDialog, { ...props, id: id, isOpen: isOpen, onClickClose: actualOnClickClose });
};
exports.RemoteTriggerFormDialog = RemoteTriggerFormDialog;
//# sourceMappingURL=RemoteTriggerFormDialog.js.map