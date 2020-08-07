var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import React from 'react';
import styled, { css } from 'styled-components';
import { range } from '../../libs/lodash';
import { useTheme } from '../../hooks/useTheme';
import { PaginationItem } from './PaginationItem';
import { PaginationControllerItem } from './PaginationControllerItem';
export var Pagination = function (_a) {
    var total = _a.total, current = _a.current, onClick = _a.onClick, _b = _a.padding, padding = _b === void 0 ? 4 : _b, _c = _a.className, className = _c === void 0 ? '' : _c, _d = _a.withoutNumbers, withoutNumbers = _d === void 0 ? false : _d;
    var theme = useTheme();
    if (total <= 1)
        return null;
    var prevPage = (React.createElement(React.Fragment, null,
        React.createElement("li", { className: "prevDouble" },
            React.createElement(PaginationControllerItem, { onClick: onClick, direction: "prev", targetPage: 1, disabled: current === 1, double: true })),
        React.createElement("li", { className: "prev" },
            React.createElement(PaginationControllerItem, { onClick: onClick, direction: "prev", targetPage: current - 1, disabled: current === 1 }))));
    var pages = !withoutNumbers
        ? __spreadArrays(range(current - padding, current).filter(function (page) { return page >= 1; }), range(current, current + padding + 1).filter(function (page) { return page <= total; })).map(function (page) { return (React.createElement("li", { key: "pagination-" + page },
            React.createElement(PaginationItem, { page: page, currentPage: current, onClick: onClick }))); })
        : null;
    var nextPage = (React.createElement(React.Fragment, null,
        React.createElement("li", { className: "next" },
            React.createElement(PaginationControllerItem, { onClick: onClick, direction: "next", targetPage: current + 1, disabled: current === total })),
        React.createElement("li", { className: "nextDouble" },
            React.createElement(PaginationControllerItem, { onClick: onClick, direction: "next", targetPage: total, disabled: current === total, double: true }))));
    return (React.createElement(Wrapper, { className: className },
        React.createElement(List, { className: withoutNumbers ? 'withoutNumbers' : '', themes: theme },
            prevPage,
            pages,
            nextPage)));
};
var Wrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: inline-block;\n"], ["\n  display: inline-block;\n"])));
var List = styled.ul(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space;
    return css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      display: flex;\n      margin: 0;\n      padding: 0;\n      > li {\n        list-style: none;\n        margin-left: ", ";\n        &.prev {\n          margin-right: ", ";\n          + li {\n            margin-left: 0;\n          }\n        }\n        &.next {\n          margin-left: ", ";\n        }\n        &.prevDouble {\n          margin-left: 0;\n        }\n      }\n      &.withoutNumbers {\n        > li {\n          &.prev {\n            margin-left: ", ";\n            margin-right: 0;\n          }\n          &.next {\n            margin-left: ", ";\n          }\n          &.nextDouble {\n            margin-left: ", ";\n          }\n        }\n      }\n    "], ["\n      display: flex;\n      margin: 0;\n      padding: 0;\n      > li {\n        list-style: none;\n        margin-left: ", ";\n        &.prev {\n          margin-right: ", ";\n          + li {\n            margin-left: 0;\n          }\n        }\n        &.next {\n          margin-left: ", ";\n        }\n        &.prevDouble {\n          margin-left: 0;\n        }\n      }\n      &.withoutNumbers {\n        > li {\n          &.prev {\n            margin-left: ", ";\n            margin-right: 0;\n          }\n          &.next {\n            margin-left: ", ";\n          }\n          &.nextDouble {\n            margin-left: ", ";\n          }\n        }\n      }\n    "])), pxToRem(space.XXS), pxToRem(space.XS), pxToRem(space.XS), pxToRem(space.XS), pxToRem(space.XXS), pxToRem(space.XS));
});
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=Pagination.js.map