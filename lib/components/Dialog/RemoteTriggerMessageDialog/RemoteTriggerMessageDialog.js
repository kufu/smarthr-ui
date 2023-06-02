"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteTriggerMessageDialog = void 0;
const react_1 = __importDefault(require("react"));
const MessageDialog_1 = require("../MessageDialog");
const useRemoteTrigger_1 = require("../useRemoteTrigger");
const RemoteTriggerMessageDialog = ({ id, onClickClose, ...props }) => {
    const { isOpen, onClickClose: actualOnClickClose } = (0, useRemoteTrigger_1.useRemoteTrigger)({ id, onClickClose });
    return react_1.default.createElement(MessageDialog_1.MessageDialog, { ...props, id: id, isOpen: isOpen, onClickClose: actualOnClickClose });
};
exports.RemoteTriggerMessageDialog = RemoteTriggerMessageDialog;
//# sourceMappingURL=RemoteTriggerMessageDialog.js.map