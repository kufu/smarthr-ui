var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { DefinitionListItem } from './DefinitionListItem';
export var DefinitionList = function (_a) {
    var items = _a.items, _b = _a.layout, layout = _b === void 0 ? 'single' : _b, _c = _a.className, className = _c === void 0 ? '' : _c;
    var theme = useTheme();
    return (React.createElement(Wrapper, { className: className, layout: layout }, items.map(function (item, index) { return (React.createElement(Item, { term: item.term, description: item.description, key: index, layout: layout, className: item.className && item.className, themes: theme })); })));
};
var Wrapper = styled.dl(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var layout = _a.layout;
    var baseStyle = css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      padding: 0;\n      margin: 0;\n    "], ["\n      padding: 0;\n      margin: 0;\n    "])));
    var flexStyle = css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      display: flex;\n      justify-content: space-between;\n      align-items: flex-start;\n      align-content: flex-start;\n      flex-wrap: wrap;\n    "], ["\n      display: flex;\n      justify-content: space-between;\n      align-items: flex-start;\n      align-content: flex-start;\n      flex-wrap: wrap;\n    "])));
    switch (layout) {
        case 'double':
            return css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n          ", "\n          ", "\n        "], ["\n          ", "\n          ", "\n        "])), baseStyle, flexStyle);
        case 'triple':
            return css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n          ", "\n          ", "\n          &:after {\n            content: '';\n            display: block;\n            flex-basis: calc(33.333333% - 12px);\n          }\n        "], ["\n          ", "\n          ", "\n          &:after {\n            content: '';\n            display: block;\n            flex-basis: calc(33.333333% - 12px);\n          }\n        "])), baseStyle, flexStyle);
        default:
            return css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n          ", "\n          display: block;\n        "], ["\n          ", "\n          display: block;\n        "])), baseStyle);
    }
});
var Item = styled(DefinitionListItem)(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes, layout = _a.layout;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space;
    var basicStyle = css(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n      margin-bottom: ", ";\n    "], ["\n      margin-bottom: ", ";\n    "])), pxToRem(space.S));
    switch (layout) {
        case 'double':
            return css(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n          ", "\n          flex-basis: calc(50% - 12px);\n\n          &:last-child,\n          &:nth-last-child(2) {\n            margin-bottom: 0;\n          }\n        "], ["\n          ", "\n          flex-basis: calc(50% - 12px);\n\n          &:last-child,\n          &:nth-last-child(2) {\n            margin-bottom: 0;\n          }\n        "])), basicStyle);
        case 'triple':
            return css(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n          ", "\n          flex-basis: calc(33.333333% - 12px);\n\n          &:last-child,\n          &:nth-last-child(2),\n          &:nth-last-child(3) {\n            margin-bottom: 0;\n          }\n        "], ["\n          ", "\n          flex-basis: calc(33.333333% - 12px);\n\n          &:last-child,\n          &:nth-last-child(2),\n          &:nth-last-child(3) {\n            margin-bottom: 0;\n          }\n        "])), basicStyle);
        default:
            return css(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n          ", "\n\n          &:last-child {\n            margin-bottom: 0;\n          }\n        "], ["\n          ", "\n\n          &:last-child {\n            margin-bottom: 0;\n          }\n        "])), basicStyle);
    }
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11;
//# sourceMappingURL=DefinitionList.js.map