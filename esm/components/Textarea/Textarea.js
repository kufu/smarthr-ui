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
import React, { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
var getStringLength = function (value) {
    var formattedValue = typeof value === 'number' || typeof value === 'string'
        ? "" + value
        : Array.isArray(value)
            ? value.join(',')
            : '';
    // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt
    var surrogatePairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
    return formattedValue.length - (formattedValue.match(surrogatePairs) || []).length;
};
export var Textarea = function (_a) {
    var autoFocus = _a.autoFocus, maxLength = _a.maxLength, props = __rest(_a, ["autoFocus", "maxLength"]);
    var theme = useTheme();
    var ref = useRef(null);
    var currentValue = props.defaultValue || props.value;
    var _b = useState(currentValue ? getStringLength(currentValue) : 0), count = _b[0], setCount = _b[1];
    useEffect(function () {
        if (autoFocus && ref && ref.current) {
            ref.current.focus();
        }
    }, [autoFocus]);
    var handleKeyup = function (event) {
        setCount(getStringLength(event.currentTarget.value));
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(StyledTextarea, __assign({}, (maxLength ? { onKeyUp: handleKeyup } : {}), props, { ref: ref, themes: theme })),
        maxLength && (React.createElement(Counter, { themes: theme },
            "\u3042\u3068",
            React.createElement("span", { className: maxLength && maxLength - count <= 0 ? 'error' : '' }, maxLength - count),
            "\u6587\u5B57"))));
};
var StyledTextarea = styled.textarea(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (props) {
    var themes = props.themes, _a = props.width, width = _a === void 0 ? 'auto' : _a, error = props.error;
    var size = themes.size, frame = themes.frame, palette = themes.palette;
    return css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      padding: ", ";\n      font-size: ", ";\n      color: ", ";\n      border-radius: ", ";\n      ", "\n      background-color: #fff;\n      outline: none;\n      border: ", ";\n      ", "\n\n      &[disabled] {\n        background-color: ", ";\n        pointer-events: none;\n        color: ", ";\n      }\n    "], ["\n      padding: ", ";\n      font-size: ", ";\n      color: ", ";\n      border-radius: ", ";\n      ",
        "\n      background-color: #fff;\n      outline: none;\n      border: ", ";\n      ",
        "\n\n      &[disabled] {\n        background-color: ", ";\n        pointer-events: none;\n        color: ", ";\n      }\n    "])), size.pxToRem(size.space.XXS), size.pxToRem(size.font.TALL), palette.TEXT_BLACK, frame.border.radius.m, width && css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n        width: ", ";\n      "], ["\n        width: ", ";\n      "])), typeof width === 'number' ? width + "px" : width), frame.border.default, error
        ? css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n            border-color: ", ";\n          "], ["\n            border-color: ", ";\n          "])), palette.DANGER) : css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n            &:focus {\n              border-color: ", ";\n            }\n          "], ["\n            &:focus {\n              border-color: ", ";\n            }\n          "])), palette.hoverColor(palette.MAIN)), palette.COLUMN, palette.TEXT_DISABLED);
});
var Counter = styled.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var palette = themes.palette, size = themes.size;
    return css(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n      font-size: ", ";\n      > span {\n        font-weight: bold;\n        color: ", ";\n        &.error {\n          color: ", ";\n        }\n      }\n    "], ["\n      font-size: ", ";\n      > span {\n        font-weight: bold;\n        color: ", ";\n        &.error {\n          color: ", ";\n        }\n      }\n    "])), size.pxToRem(size.font.SHORT), palette.TEXT_GREY, palette.DANGER);
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=Textarea.js.map