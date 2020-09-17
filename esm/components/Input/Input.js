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
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState, } from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
export var Input = forwardRef(function (_a, ref) {
    var onFocus = _a.onFocus, onBlur = _a.onBlur, autoFocus = _a.autoFocus, prefix = _a.prefix, suffix = _a.suffix, className = _a.className, props = __rest(_a, ["onFocus", "onBlur", "autoFocus", "prefix", "suffix", "className"]);
    var theme = useTheme();
    var innerRef = useRef(null);
    var _b = useState(false), isFocused = _b[0], setIsFocused = _b[1];
    useImperativeHandle(ref, function () { return innerRef.current; });
    var handleFocus = function (e) {
        setIsFocused(true);
        onFocus && onFocus(e);
    };
    var handleBlur = function (e) {
        setIsFocused(false);
        onBlur && onBlur(e);
    };
    useEffect(function () {
        if (autoFocus && innerRef.current) {
            innerRef.current.focus();
        }
    }, [autoFocus]);
    return (React.createElement(Wrapper, { themes: theme, width: props.width, isFocused: isFocused, disabled: props.disabled, error: props.error, onClick: function () { var _a; return (_a = innerRef.current) === null || _a === void 0 ? void 0 : _a.focus(); }, className: className },
        prefix && React.createElement(Prefix, { themes: theme }, prefix),
        React.createElement(StyledInput, __assign({ onFocus: handleFocus, onBlur: handleBlur }, props, { ref: innerRef, themes: theme })),
        suffix && React.createElement(Suffix, { themes: theme }, suffix)));
});
var Wrapper = styled.span(function (_a) {
    var themes = _a.themes, _b = _a.width, width = _b === void 0 ? 'auto' : _b, isFocused = _a.isFocused, disabled = _a.disabled, error = _a.error;
    var frame = themes.frame, palette = themes.palette, size = themes.size;
    return css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    display: inline-flex;\n    align-items: stretch;\n    width: ", ";\n    padding: 0 ", ";\n    background-color: #fff;\n    border-radius: ", ";\n    border: ", ";\n    box-sizing: border-box;\n    cursor: text;\n    ", "\n    ", "\n    ", "\n  "], ["\n    display: inline-flex;\n    align-items: stretch;\n    width: ", ";\n    padding: 0 ", ";\n    background-color: #fff;\n    border-radius: ", ";\n    border: ", ";\n    box-sizing: border-box;\n    cursor: text;\n    ",
        "\n    ",
        "\n    ",
        "\n  "])), typeof width === 'number' ? width + "px" : width, size.pxToRem(size.space.XXS), frame.border.radius.m, frame.border.default, isFocused && css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      border-color: ", ";\n    "], ["\n      border-color: ", ";\n    "])), palette.hoverColor(palette.MAIN)), !disabled &&
        error && css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      border-color: ", ";\n    "], ["\n      border-color: ", ";\n    "])), palette.DANGER), disabled && css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      background-color: ", ";\n      pointer-events: none;\n    "], ["\n      background-color: ", ";\n      pointer-events: none;\n    "])), palette.COLUMN));
});
var StyledInput = styled.input(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (props) {
    var themes = props.themes;
    var size = themes.size, palette = themes.palette;
    return css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n      flex-grow: 1;\n      display: inline-block;\n      width: 100%;\n      padding: ", " 0;\n      border: none;\n      background-color: transparent;\n      font-size: ", ";\n      color: ", ";\n      line-height: 1.6;\n      outline: none;\n\n      &::placeholder {\n        color: ", ";\n      }\n\n      &[disabled] {\n        color: ", ";\n      }\n    "], ["\n      flex-grow: 1;\n      display: inline-block;\n      width: 100%;\n      padding: ", " 0;\n      border: none;\n      background-color: transparent;\n      font-size: ", ";\n      color: ", ";\n      line-height: 1.6;\n      outline: none;\n\n      &::placeholder {\n        color: ", ";\n      }\n\n      &[disabled] {\n        color: ", ";\n      }\n    "])), size.pxToRem(size.space.XXS), size.pxToRem(size.font.TALL), palette.TEXT_BLACK, palette.TEXT_GREY, palette.TEXT_DISABLED);
});
var Prefix = styled.span(function (_a) {
    var themes = _a.themes;
    var size = themes.size;
    return css(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n    display: inline-flex;\n    align-items: center;\n    margin-right: ", ";\n  "], ["\n    display: inline-flex;\n    align-items: center;\n    margin-right: ", ";\n  "])), size.pxToRem(size.space.XXS));
});
var Suffix = styled.span(function (_a) {
    var themes = _a.themes;
    var size = themes.size;
    return css(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n    display: inline-flex;\n    align-items: center;\n    margin-left: ", ";\n  "], ["\n    display: inline-flex;\n    align-items: center;\n    margin-left: ", ";\n  "])), size.pxToRem(size.space.XXS));
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
//# sourceMappingURL=Input.js.map