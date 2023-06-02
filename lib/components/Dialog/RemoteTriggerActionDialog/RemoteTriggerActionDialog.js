"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteTriggerActionDialog = void 0;
const react_1 = __importDefault(require("react"));
const ActionDialog_1 = require("../ActionDialog");
const useRemoteTrigger_1 = require("../useRemoteTrigger");
const RemoteTriggerActionDialog = ({ id, onClickClose, ...props }) => {
    const { isOpen, onClickClose: actualOnClickClose } = (0, useRemoteTrigger_1.useRemoteTrigger)({ id, onClickClose });
    return react_1.default.createElement(ActionDialog_1.ActionDialog, { ...props, id: id, isOpen: isOpen, onClickClose: actualOnClickClose });
};
exports.RemoteTriggerActionDialog = RemoteTriggerActionDialog;
//# sourceMappingURL=RemoteTriggerActionDialog.js.map