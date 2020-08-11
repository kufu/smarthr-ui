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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagination = void 0;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var lodash_1 = require("../../libs/lodash");
var useTheme_1 = require("../../hooks/useTheme");
var PaginationItem_1 = require("./PaginationItem");
var PaginationControllerItem_1 = require("./PaginationControllerItem");
exports.Pagination = function (_a) {
    var total = _a.total, current = _a.current, onClick = _a.onClick, _b = _a.padding, padding = _b === void 0 ? 4 : _b, _c = _a.className, className = _c === void 0 ? '' : _c, _d = _a.withoutNumbers, withoutNumbers = _d === void 0 ? false : _d;
    var theme = useTheme_1.useTheme();
    if (total <= 1)
        return null;
    var prevPage = (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("li", { className: "prevDouble" },
            react_1.default.createElement(PaginationControllerItem_1.PaginationControllerItem, { onClick: onClick, direction: "prev", targetPage: 1, disabled: current === 1, double: true })),
        react_1.default.createElement("li", { className: "prev" },
            react_1.default.createElement(PaginationControllerItem_1.PaginationControllerItem, { onClick: onClick, direction: "prev", targetPage: current - 1, disabled: current === 1 }))));
    var pages = !withoutNumbers
        ? __spreadArrays(lodash_1.range(current - padding, current).filter(function (page) { return page >= 1; }), lodash_1.range(current, current + padding + 1).filter(function (page) { return page <= total; })).map(function (page) { return (react_1.default.createElement("li", { key: "pagination-" + page },
            react_1.default.createElement(PaginationItem_1.PaginationItem, { page: page, currentPage: current, onClick: onClick }))); })
        : null;
    var nextPage = (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("li", { className: "next" },
            react_1.default.createElement(PaginationControllerItem_1.PaginationControllerItem, { onClick: onClick, direction: "next", targetPage: current + 1, disabled: current === total })),
        react_1.default.createElement("li", { className: "nextDouble" },
            react_1.default.createElement(PaginationControllerItem_1.PaginationControllerItem, { onClick: onClick, direction: "next", targetPage: total, disabled: current === total, double: true }))));
    return (react_1.default.createElement(Wrapper, { className: className },
        react_1.default.createElement(List, { className: withoutNumbers ? 'withoutNumbers' : '', themes: theme },
            prevPage,
            pages,
            nextPage)));
};
var Wrapper = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: inline-block;\n"], ["\n  display: inline-block;\n"])));
var List = styled_components_1.default.ul(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space;
    return styled_components_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      display: flex;\n      margin: 0;\n      padding: 0;\n      > li {\n        list-style: none;\n        margin-left: ", ";\n        &.prev {\n          margin-right: ", ";\n          + li {\n            margin-left: 0;\n          }\n        }\n        &.next {\n          margin-left: ", ";\n        }\n        &.prevDouble {\n          margin-left: 0;\n        }\n      }\n      &.withoutNumbers {\n        > li {\n          &.prev {\n            margin-left: ", ";\n            margin-right: 0;\n          }\n          &.next {\n            margin-left: ", ";\n          }\n          &.nextDouble {\n            margin-left: ", ";\n          }\n        }\n      }\n    "], ["\n      display: flex;\n      margin: 0;\n      padding: 0;\n      > li {\n        list-style: none;\n        margin-left: ", ";\n        &.prev {\n          margin-right: ", ";\n          + li {\n            margin-left: 0;\n          }\n        }\n        &.next {\n          margin-left: ", ";\n        }\n        &.prevDouble {\n          margin-left: 0;\n        }\n      }\n      &.withoutNumbers {\n        > li {\n          &.prev {\n            margin-left: ", ";\n            margin-right: 0;\n          }\n          &.next {\n            margin-left: ", ";\n          }\n          &.nextDouble {\n            margin-left: ", ";\n          }\n        }\n      }\n    "])), pxToRem(space.XXS), pxToRem(space.XS), pxToRem(space.XS), pxToRem(space.XS), pxToRem(space.XXS), pxToRem(space.XS));
});
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=Pagination.js.map