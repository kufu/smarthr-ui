"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.includeDisabledTrigger = void 0;
const react_1 = __importDefault(require("react"));
const includeDisabledTrigger = (trigger) => react_1.default.Children.map(trigger, (t) => react_1.default.isValidElement(t) && t.props.disabled)?.some((bool) => bool);
exports.includeDisabledTrigger = includeDisabledTrigger;
//# sourceMappingURL=util.js.map