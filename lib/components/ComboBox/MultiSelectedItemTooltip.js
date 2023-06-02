"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiSelectedItemTooltip = void 0;
const react_1 = __importDefault(require("react"));
const Tooltip_1 = require("../Tooltip");
const MultiSelectedItemTooltip = ({ needsTooltip, text, children }) => {
    return needsTooltip ? (react_1.default.createElement(Tooltip_1.Tooltip, { message: text, multiLine: true }, children)) : (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    react_1.default.createElement(react_1.default.Fragment, null, children));
};
exports.MultiSelectedItemTooltip = MultiSelectedItemTooltip;
//# sourceMappingURL=MultiSelectedItemTooltip.js.map