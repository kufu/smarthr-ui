"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.DropdownCloser = void 0;
var react_1 = __importStar(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var DropdownContent_1 = require("./DropdownContent");
var DropdownContentInner_1 = require("./DropdownContentInner");
exports.DropdownCloser = function (_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b;
    var _c = react_1.useContext(DropdownContent_1.DropdownContentContext), onClickCloser = _c.onClickCloser, controllable = _c.controllable, scrollable = _c.scrollable;
    var maxHeight = react_1.useContext(DropdownContentInner_1.DropdownContentInnerContext).maxHeight;
    return (react_1.default.createElement(Wrapper, { className: className, onClick: onClickCloser, maxHeight: maxHeight, controllable: controllable, scrollable: scrollable }, children));
};
var Wrapper = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var maxHeight = _a.maxHeight, controllable = _a.controllable, scrollable = _a.scrollable;
    return styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      ", "\n      ", "\n    "], ["\n      ",
        "\n      ", "\n    "])), !controllable
        ? "\n      display: flex;\n      flex-direction: column;\n      "
        : '', !controllable && scrollable ? "max-height: " + maxHeight + ";" : '');
});
var templateObject_1, templateObject_2;
//# sourceMappingURL=DropdownCloser.js.map