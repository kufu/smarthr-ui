"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Row = void 0;
const react_1 = __importDefault(require("react"));
const useClassNames_1 = require("./useClassNames");
/**
 * @deprecated Row コンポーネントは非推奨です。tr 要素に置き換えてください。
 */
const Row = ({ className = '', children, ...props }) => {
    const classNames = (0, useClassNames_1.useClassNames)().row;
    return (react_1.default.createElement("tr", { ...props, className: `${className} ${classNames.wrapper}` }, children));
};
exports.Row = Row;
//# sourceMappingURL=Row.js.map