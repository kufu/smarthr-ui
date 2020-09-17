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
import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { RadioButton } from '../RadioButton';
export var RadioButtonLabel = function (_a) {
    var label = _a.label, _b = _a.className, className = _b === void 0 ? '' : _b, props = __rest(_a, ["label", "className"]);
    var theme = useTheme();
    return (React.createElement(Wrapper, { className: className },
        React.createElement(Label, { className: "" + (props.disabled ? 'disabled' : ''), themes: theme },
            React.createElement(RadioButton, __assign({}, props)),
            React.createElement(Txt, { themes: theme }, label))));
};
var Wrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: inline-block;\n"], ["\n  display: inline-block;\n"])));
var Label = styled.label(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var palette = themes.palette;
    return css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      display: flex;\n      align-items: center;\n      color: ", ";\n      cursor: pointer;\n\n      &.disabled {\n        color: ", ";\n        cursor: default;\n      }\n    "], ["\n      display: flex;\n      align-items: center;\n      color: ", ";\n      cursor: pointer;\n\n      &.disabled {\n        color: ", ";\n        cursor: default;\n      }\n    "])), palette.TEXT_BLACK, palette.TEXT_DISABLED);
});
var Txt = styled.span(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size;
    return css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      margin: 0 0 0 ", ";\n      font-size: ", ";\n    "], ["\n      margin: 0 0 0 ", ";\n      font-size: ", ";\n    "])), size.pxToRem(size.space.XXS), size.pxToRem(size.font.TALL));
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=RadioButtonLabel.js.map