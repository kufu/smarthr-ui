var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
export var Heading = function (_a) {
    var _b = _a.tag, tag = _b === void 0 ? 'h1' : _b, _c = _a.type, type = _c === void 0 ? 'screenTitle' : _c, _d = _a.className, className = _d === void 0 ? '' : _d, children = _a.children, disabled = _a.disabled;
    var theme = useTheme();
    return (React.createElement(Wrapper, { as: tag, className: type + " " + (disabled && 'disabled') + " " + className, themes: theme }, children));
};
var Wrapper = styled.h1(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var palette = themes.palette, size = themes.size;
    return css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      display: block;\n      margin: 0;\n      padding: 0;\n      line-height: 1;\n\n      &.screenTitle {\n        color: ", ";\n        font-size: ", ";\n        font-weight: normal;\n      }\n\n      &.sectionTitle {\n        color: ", ";\n        font-size: ", ";\n        font-weight: normal;\n      }\n\n      &.blockTitle {\n        color: ", ";\n        font-size: ", ";\n        font-weight: bold;\n      }\n\n      &.subBlockTitle {\n        color: ", ";\n        font-size: ", ";\n        font-weight: bold;\n      }\n\n      &.subSubBlockTitle {\n        color: ", ";\n        font-size: ", ";\n        font-weight: bold;\n      }\n\n      &.disabled {\n        color: ", ";\n      }\n    "], ["\n      display: block;\n      margin: 0;\n      padding: 0;\n      line-height: 1;\n\n      &.screenTitle {\n        color: ", ";\n        font-size: ", ";\n        font-weight: normal;\n      }\n\n      &.sectionTitle {\n        color: ", ";\n        font-size: ", ";\n        font-weight: normal;\n      }\n\n      &.blockTitle {\n        color: ", ";\n        font-size: ", ";\n        font-weight: bold;\n      }\n\n      &.subBlockTitle {\n        color: ", ";\n        font-size: ", ";\n        font-weight: bold;\n      }\n\n      &.subSubBlockTitle {\n        color: ", ";\n        font-size: ", ";\n        font-weight: bold;\n      }\n\n      &.disabled {\n        color: ", ";\n      }\n    "])), palette.TEXT_BLACK, size.pxToRem(size.font.VENTI), palette.TEXT_BLACK, size.pxToRem(size.font.GRANDE), palette.TEXT_BLACK, size.pxToRem(size.font.TALL), palette.TEXT_GREY, size.pxToRem(size.font.TALL), palette.TEXT_GREY, size.pxToRem(size.font.SHORT), palette.TEXT_DISABLED);
});
var templateObject_1, templateObject_2;
//# sourceMappingURL=Heading.js.map