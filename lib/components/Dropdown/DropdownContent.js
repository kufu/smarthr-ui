"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropdownContent = exports.DropdownContentContext = void 0;
var react_1 = __importStar(require("react"));
var Dropdown_1 = require("./Dropdown");
var DropdownContentInner_1 = require("./DropdownContentInner");
exports.DropdownContentContext = react_1.default.createContext({
    onClickCloser: function () {
        /* noop */
    },
    controllable: false,
    scrollable: true,
});
exports.DropdownContent = function (_a) {
    var _b = _a.controllable, controllable = _b === void 0 ? false : _b, _c = _a.scrollable, scrollable = _c === void 0 ? true : _c, _d = _a.className, className = _d === void 0 ? '' : _d, children = _a.children;
    var _e = react_1.useContext(Dropdown_1.DropdownContext), DropdownContentRoot = _e.DropdownContentRoot, triggerRect = _e.triggerRect, onClickCloser = _e.onClickCloser;
    return (react_1.default.createElement(DropdownContentRoot, null,
        react_1.default.createElement(exports.DropdownContentContext.Provider, { value: { onClickCloser: onClickCloser, controllable: controllable, scrollable: scrollable } },
            react_1.default.createElement(DropdownContentInner_1.DropdownContentInner, { triggerRect: triggerRect, scrollable: scrollable, className: className, controllable: controllable }, children))));
};
//# sourceMappingURL=DropdownContent.js.map