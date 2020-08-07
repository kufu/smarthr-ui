var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
export var StatusLabel = function (_a) {
    var _b = _a.type, type = _b === void 0 ? 'done' : _b, _c = _a.className, className = _c === void 0 ? '' : _c, children = _a.children;
    var theme = useTheme();
    return (React.createElement(Wrapper, { className: type + " " + className, themes: theme }, children));
};
var borderStyle = function (border) { return css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  border: ", ";\n  background-color: #fff;\n"], ["\n  border: ", ";\n  background-color: #fff;\n"])), border); };
var fillStyle = function (backgroundColor) { return css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  background-color: ", ";\n  color: #fff;\n"], ["\n  background-color: ", ";\n  color: #fff;\n"])), backgroundColor); };
var Wrapper = styled.span(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size, frame = themes.frame, palette = themes.palette;
    return css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      height: ", ";\n      box-sizing: border-box;\n      margin: 0;\n      padding: 0 ", ";\n      display: inline-block;\n      white-space: nowrap;\n      font-size: ", ";\n      font-weight: bold;\n      line-height: calc(", " - ", " * 2);\n\n      &.done {\n        ", "\n        border-color: ", ";\n        color: ", ";\n      }\n\n      &.success {\n        ", "\n        border-color: ", ";\n        color: ", ";\n      }\n\n      &.process {\n        ", "\n        border-color: ", ";\n        color: ", ";\n      }\n\n      &.required {\n        ", "\n        border-color: ", ";\n        color: ", ";\n      }\n\n      &.disabled {\n        ", "\n        background-color: ", ";\n      }\n\n      &.must {\n        ", "\n        background-color: ", ";\n      }\n\n      &.warning {\n        ", "\n        background-color: ", ";\n      }\n\n      &.error {\n        ", "\n        background-color: ", ";\n      }\n    "], ["\n      height: ", ";\n      box-sizing: border-box;\n      margin: 0;\n      padding: 0 ", ";\n      display: inline-block;\n      white-space: nowrap;\n      font-size: ", ";\n      font-weight: bold;\n      line-height: calc(", " - ", " * 2);\n\n      &.done {\n        ", "\n        border-color: ", ";\n        color: ", ";\n      }\n\n      &.success {\n        ", "\n        border-color: ", ";\n        color: ", ";\n      }\n\n      &.process {\n        ", "\n        border-color: ", ";\n        color: ", ";\n      }\n\n      &.required {\n        ", "\n        border-color: ", ";\n        color: ", ";\n      }\n\n      &.disabled {\n        ", "\n        background-color: ", ";\n      }\n\n      &.must {\n        ", "\n        background-color: ", ";\n      }\n\n      &.warning {\n        ", "\n        background-color: ", ";\n      }\n\n      &.error {\n        ", "\n        background-color: ", ";\n      }\n    "])), size.pxToRem(20), size.pxToRem(size.space.XXS), size.pxToRem(size.font.SHORT), size.pxToRem(20), frame.border.lineWidth, borderStyle(frame.border.default), palette.BORDER, palette.TEXT_GREY, borderStyle(frame.border.default), palette.MAIN, palette.MAIN, borderStyle(frame.border.default), palette.WARNING, palette.WARNING, borderStyle(frame.border.default), palette.DANGER, palette.DANGER, fillStyle(palette.BORDER), palette.TEXT_GREY, fillStyle(palette.BORDER), palette.MAIN, fillStyle(palette.BORDER), palette.WARNING, fillStyle(palette.BORDER), palette.DANGER);
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=StatusLabel.js.map