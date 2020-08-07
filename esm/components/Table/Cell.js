var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React, { useContext } from 'react';
import styled, { css } from 'styled-components';
import { isTouchDevice } from '../../libs/ua';
import { useTheme } from '../../hooks/useTheme';
import { TableGroupContext } from './Table';
export var Cell = function (_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b, children = _a.children, onClick = _a.onClick, colSpan = _a.colSpan, rowSpan = _a.rowSpan, _c = _a.highlighted, highlighted = _c === void 0 ? false : _c, _d = _a.nullable, nullable = _d === void 0 ? false : _d;
    var theme = useTheme();
    var group = useContext(TableGroupContext).group;
    var classNames = [className, highlighted && 'highlighted', nullable && 'nullable']
        .filter(function (c) { return !!c; })
        .join(' ');
    var props = {
        children: children,
        onClick: onClick,
        colSpan: colSpan,
        rowSpan: rowSpan,
        className: classNames,
        themes: theme,
    };
    if (group === 'head') {
        return React.createElement(Th, __assign({}, props));
    }
    else if (group === 'body') {
        return React.createElement(Td, __assign({}, props));
    }
    else {
        return null;
    }
};
var Th = styled.th(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes, onClick = _a.onClick;
    var size = themes.size, palette = themes.palette, interaction = themes.interaction;
    return css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      font-size: ", ";\n      font-weight: bold;\n      padding: ", ";\n      color: ", ";\n      transition: ", ";\n      text-align: left;\n      line-height: 1.5;\n      vertical-align: middle;\n\n      &.highlighted {\n        background-color: ", ";\n      }\n\n      ", "\n    "], ["\n      font-size: ", ";\n      font-weight: bold;\n      padding: ", ";\n      color: ", ";\n      transition: ", ";\n      text-align: left;\n      line-height: 1.5;\n      vertical-align: middle;\n\n      &.highlighted {\n        background-color: ", ";\n      }\n\n      ",
        "\n    "])), size.pxToRem(size.font.SHORT), size.pxToRem(size.space.XS), palette.TEXT_GREY, isTouchDevice ? 'none' : "background-color " + interaction.hover.animation, palette.hoverColor(palette.COLUMN), onClick && css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n        :hover {\n          background-color: ", ";\n          cursor: pointer;\n        }\n      "], ["\n        :hover {\n          background-color: ", ";\n          cursor: pointer;\n        }\n      "])), palette.hoverColor(palette.COLUMN)));
});
var Td = styled.td(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  &.nullable {\n    &:empty {\n      &::after {\n        content: '-----';\n      }\n    }\n  }\n\n  ", ";\n"], ["\n  &.nullable {\n    &:empty {\n      &::after {\n        content: '-----';\n      }\n    }\n  }\n\n  ",
    ";\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size, palette = themes.palette, frame = themes.frame;
    return css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      color: ", ";\n      padding: ", ";\n      border-top: ", ";\n      font-size: ", ";\n      line-height: 1.5;\n      vertical-align: middle;\n    "], ["\n      color: ", ";\n      padding: ", ";\n      border-top: ", ";\n      font-size: ", ";\n      line-height: 1.5;\n      vertical-align: middle;\n    "])), palette.TEXT_BLACK, size.pxToRem(size.space.XS), frame.border.default, size.pxToRem(size.font.TALL));
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=Cell.js.map