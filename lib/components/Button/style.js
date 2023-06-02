"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PREFIX = exports.Style = void 0;
const react_1 = __importDefault(require("react"));
const _1 = require(".");
const Style = () => (react_1.default.createElement(react_1.default.Fragment, null,
    react_1.default.createElement(_1.Button, null),
    react_1.default.createElement(_1.AnchorButton, null),
    react_1.default.createElement(_1.PrimaryButton, null),
    react_1.default.createElement(_1.PrimaryButtonAnchor, null),
    react_1.default.createElement(_1.SecondaryButton, null),
    react_1.default.createElement(_1.SecondaryButtonAnchor, null),
    react_1.default.createElement(_1.DangerButton, null),
    react_1.default.createElement(_1.DangerButtonAnchor, null),
    react_1.default.createElement(_1.SkeletonButton, null),
    react_1.default.createElement(_1.SkeletonButtonAnchor, null),
    react_1.default.createElement(_1.TextButton, null),
    react_1.default.createElement(_1.TextButtonAnchor, null),
    react_1.default.createElement(_1.UnstyledButton, null)));
exports.Style = Style;
exports.PREFIX = 'Button';
//# sourceMappingURL=style.js.map