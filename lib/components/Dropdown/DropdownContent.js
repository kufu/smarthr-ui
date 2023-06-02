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
exports.DropdownContent = exports.DropdownContentContext = void 0;
const react_1 = __importStar(require("react"));
const Dropdown_1 = require("./Dropdown");
const DropdownContentInner_1 = require("./DropdownContentInner");
const useClassNames_1 = require("./useClassNames");
exports.DropdownContentContext = react_1.default.createContext({
    onClickCloser: () => {
        /* noop */
    },
    controllable: false,
    scrollable: true,
});
const DropdownContent = ({ controllable = false, scrollable = true, className = '', children, ...props }) => {
    const { DropdownContentRoot, triggerRect, onClickCloser } = (0, react_1.useContext)(Dropdown_1.DropdownContext);
    const classNames = (0, useClassNames_1.useClassNames)();
    return (react_1.default.createElement(DropdownContentRoot, null,
        react_1.default.createElement(exports.DropdownContentContext.Provider, { value: { onClickCloser, controllable, scrollable } },
            react_1.default.createElement(DropdownContentInner_1.DropdownContentInner, { ...props, triggerRect: triggerRect, scrollable: scrollable, className: `${className} ${classNames.content}`, controllable: controllable }, children))));
};
exports.DropdownContent = DropdownContent;
//# sourceMappingURL=DropdownContent.js.map