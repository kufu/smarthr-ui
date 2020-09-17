var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { SecondaryButton } from '../Button';
export var PaginationItem = function (_a) {
    var page = _a.page, currentPage = _a.currentPage, onClick = _a.onClick;
    var theme = useTheme();
    if (page === currentPage) {
        return (React.createElement(ItemButton, { square: true, size: "s", className: "paginationItem active", themes: theme, disabled: true }, page));
    }
    return (React.createElement(ItemButton, { square: true, size: "s", className: "paginationItem", onClick: function () { return onClick(page); }, themes: theme }, page));
};
export var ItemButton = styled(SecondaryButton)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var MAIN = themes.palette.MAIN;
    return css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      &.paginationItem.s.square {\n        line-height: 25px;\n        border-radius: 4px;\n        &.active {\n          color: #fff;\n          background-color: ", ";\n          border: solid 1px ", ";\n          cursor: default;\n          outline: none;\n        }\n      }\n    "], ["\n      &.paginationItem.s.square {\n        line-height: 25px;\n        border-radius: 4px;\n        &.active {\n          color: #fff;\n          background-color: ", ";\n          border: solid 1px ", ";\n          cursor: default;\n          outline: none;\n        }\n      }\n    "])), MAIN, MAIN);
});
var templateObject_1, templateObject_2;
//# sourceMappingURL=PaginationItem.js.map