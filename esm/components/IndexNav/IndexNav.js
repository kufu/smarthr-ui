var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
export var IndexNav = function (_a) {
    var items = _a.items;
    var themes = useTheme();
    if (items.length === 0) {
        return null;
    }
    return (React.createElement(List, { themes: themes }, items.map(function (item, i) { return (React.createElement(Item, { key: i, themes: themes },
        React.createElement(Anchor, { href: item.href, current: item.current, "aria-current": item.current ? 'page' : undefined, themes: themes }, item.label),
        item.children && React.createElement(IndexNav, { items: item.children }))); })));
};
var List = styled.ul(function (_a) {
    var themes = _a.themes;
    var size = themes.size;
    return css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    list-style: none;\n    margin: 0;\n    padding: 0;\n    font-size: ", ";\n  "], ["\n    list-style: none;\n    margin: 0;\n    padding: 0;\n    font-size: ", ";\n  "])), size.pxToRem(size.font.TALL));
});
var Item = styled.li(function (_a) {
    var themes = _a.themes;
    var size = themes.size;
    return css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    line-height: 1em;\n    &:not(:first-child) {\n      margin-top: ", ";\n    }\n    & > ", " {\n      margin-top: ", ";\n      margin-left: ", ";\n      font-size: ", ";\n    }\n  "], ["\n    line-height: 1em;\n    &:not(:first-child) {\n      margin-top: ", ";\n    }\n    & > ", " {\n      margin-top: ", ";\n      margin-left: ", ";\n      font-size: ", ";\n    }\n  "])), size.pxToRem(size.space.XS), List, size.pxToRem(size.space.XS), size.pxToRem(size.space.S), size.pxToRem(size.font.SHORT));
});
var Anchor = styled.a(function (_a) {
    var themes = _a.themes, current = _a.current;
    var palette = themes.palette, size = themes.size;
    return css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    padding-left: ", ";\n    border-left: 2px solid;\n    border-color: ", ";\n    line-height: 1em;\n    color: ", ";\n    font-weight: ", ";\n    text-decoration: none;\n    :hover {\n      text-decoration: underline;\n    }\n  "], ["\n    padding-left: ", ";\n    border-left: 2px solid;\n    border-color: ", ";\n    line-height: 1em;\n    color: ", ";\n    font-weight: ", ";\n    text-decoration: none;\n    :hover {\n      text-decoration: underline;\n    }\n  "])), size.pxToRem(size.space.XXS), current ? palette.MAIN : 'transparent', palette.TEXT_BLACK, current ? 'bold' : 'normal');
});
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=IndexNav.js.map