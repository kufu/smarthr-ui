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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemButton = exports.PaginationItem = void 0;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var useTheme_1 = require("../../hooks/useTheme");
var Button_1 = require("../Button");
exports.PaginationItem = function (_a) {
    var page = _a.page, currentPage = _a.currentPage, onClick = _a.onClick;
    var theme = useTheme_1.useTheme();
    if (page === currentPage) {
        return (react_1.default.createElement(exports.ItemButton, { square: true, size: "s", className: "paginationItem active", themes: theme, disabled: true }, page));
    }
    return (react_1.default.createElement(exports.ItemButton, { square: true, size: "s", className: "paginationItem", onClick: function () { return onClick(page); }, themes: theme }, page));
};
exports.ItemButton = styled_components_1.default(Button_1.SecondaryButton)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var MAIN = themes.palette.MAIN;
    return styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      &.paginationItem.s.square {\n        line-height: 25px;\n        border-radius: 4px;\n        &.active {\n          color: #fff;\n          background-color: ", ";\n          border: solid 1px ", ";\n          cursor: default;\n          outline: none;\n        }\n      }\n    "], ["\n      &.paginationItem.s.square {\n        line-height: 25px;\n        border-radius: 4px;\n        &.active {\n          color: #fff;\n          background-color: ", ";\n          border: solid 1px ", ";\n          cursor: default;\n          outline: none;\n        }\n      }\n    "])), MAIN, MAIN);
});
var templateObject_1, templateObject_2;
//# sourceMappingURL=PaginationItem.js.map