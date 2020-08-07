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
exports.Table = exports.TableGroupContext = void 0;
var react_1 = __importStar(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var useTheme_1 = require("../../hooks/useTheme");
exports.TableGroupContext = react_1.createContext({
    group: 'body',
});
exports.Table = function (_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b;
    var theme = useTheme_1.useTheme();
    return (react_1.default.createElement(Wrapper, { themes: theme, className: className }, children));
};
var Wrapper = styled_components_1.default.table(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var COLUMN = themes.palette.COLUMN;
    return styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      width: 100%;\n      border-collapse: collapse;\n      border-spacing: 0;\n      background-color: ", ";\n\n      th {\n        background-color: ", ";\n      }\n    "], ["\n      width: 100%;\n      border-collapse: collapse;\n      border-spacing: 0;\n      background-color: ", ";\n\n      th {\n        background-color: ", ";\n      }\n    "])), COLUMN, COLUMN);
});
var templateObject_1, templateObject_2;
//# sourceMappingURL=Table.js.map