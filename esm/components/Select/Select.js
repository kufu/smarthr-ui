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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { useCallback } from 'react';
import styled, { css } from 'styled-components';
import { isTouchDevice } from '../../libs/ua';
import { useTheme } from '../../hooks/useTheme';
import { Icon } from '../Icon';
export var Select = function (_a) {
    var options = _a.options, onChange = _a.onChange, _b = _a.error, error = _b === void 0 ? false : _b, _c = _a.width, width = _c === void 0 ? 260 : _c, _d = _a.className, className = _d === void 0 ? '' : _d, props = __rest(_a, ["options", "onChange", "error", "width", "className"]);
    var theme = useTheme();
    var widthStyle = typeof width === 'number' ? width + "px" : width;
    var handleChange = useCallback(function (e) {
        if (onChange)
            onChange(e);
    }, [onChange]);
    return (React.createElement(Wrapper, { className: className, width: widthStyle, theme: theme },
        React.createElement(SelectBox, __assign({ className: error ? 'error' : '', onChange: handleChange, themes: theme }, props), options.map(function (option) {
            if ('value' in option) {
                return (React.createElement("option", { key: option.value, value: option.value }, option.label));
            }
            var optgroup = option;
            return (React.createElement("optgroup", { key: optgroup.label, label: optgroup.label }, optgroup.options.map(function (o) { return (React.createElement("option", { key: o.value, value: o.value }, o.label)); })));
        })),
        React.createElement(IconWrap, null,
            React.createElement(Icon, { size: 13, name: "fa-sort" }))));
};
var Wrapper = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var width = _a.width;
    return css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      position: relative;\n      width: ", ";\n    "], ["\n      position: relative;\n      width: ", ";\n    "])), width);
});
var SelectBox = styled.select(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size, frame = themes.frame, palette = themes.palette, interaction = themes.interaction;
    return css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      display: inline-block;\n      width: 100%;\n      padding: ", ";\n      padding-right: ", ";\n      border-radius: ", ";\n      border: ", ";\n      background-color: #fff;\n      font-size: ", ";\n      color: ", ";\n      line-height: 1.6;\n      outline: none;\n      box-sizing: border-box;\n      appearance: none;\n      cursor: pointer;\n      transition: ", ";\n\n      &:hover {\n        background-color: ", ";\n      }\n\n      &::placeholder {\n        color: ", ";\n      }\n\n      &:focus {\n        border-color: ", ";\n      }\n\n      &.error {\n        border-color: ", ";\n      }\n\n      &[disabled] {\n        border-color: #f5f5f5;\n        pointer-events: none;\n        cursor: not-allowed;\n        background-color: #f5f5f5;\n        color: #c1c1c1;\n      }\n\n      &::-ms-expand {\n        display: none;\n      }\n    "], ["\n      display: inline-block;\n      width: 100%;\n      padding: ", ";\n      padding-right: ", ";\n      border-radius: ", ";\n      border: ", ";\n      background-color: #fff;\n      font-size: ", ";\n      color: ", ";\n      line-height: 1.6;\n      outline: none;\n      box-sizing: border-box;\n      appearance: none;\n      cursor: pointer;\n      transition: ", ";\n\n      &:hover {\n        background-color: ", ";\n      }\n\n      &::placeholder {\n        color: ", ";\n      }\n\n      &:focus {\n        border-color: ", ";\n      }\n\n      &.error {\n        border-color: ", ";\n      }\n\n      &[disabled] {\n        border-color: #f5f5f5;\n        pointer-events: none;\n        cursor: not-allowed;\n        background-color: #f5f5f5;\n        color: #c1c1c1;\n      }\n\n      &::-ms-expand {\n        display: none;\n      }\n    "])), size.pxToRem(size.space.XXS), size.pxToRem(size.space.M), frame.border.radius.m, frame.border.default, size.pxToRem(size.font.TALL), palette.TEXT_BLACK, isTouchDevice ? 'none' : "all " + interaction.hover.animation, palette.hoverColor('#fff'), palette.TEXT_GREY, palette.MAIN, palette.DANGER);
});
var IconWrap = styled.span(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  position: absolute;\n  top: 50%;\n  right: 6px;\n  display: inline-block;\n  width: 13px;\n  height: 13px;\n  transform: translate(-50%, -50%);\n  pointer-events: none;\n\n  & > svg {\n    vertical-align: top;\n  }\n"], ["\n  position: absolute;\n  top: 50%;\n  right: 6px;\n  display: inline-block;\n  width: 13px;\n  height: 13px;\n  transform: translate(-50%, -50%);\n  pointer-events: none;\n\n  & > svg {\n    vertical-align: top;\n  }\n"])));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=Select.js.map