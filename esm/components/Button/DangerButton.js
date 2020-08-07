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
import React from 'react';
import styled, { css } from 'styled-components';
import { isTouchDevice } from '../../libs/ua';
import { useTheme } from '../../hooks/useTheme';
import { BaseButton, BaseButtonAnchor } from './BaseButton';
export var DangerButton = function (props) {
    var theme = useTheme();
    return React.createElement(DangerStyleButton, __assign({ themes: theme }, props));
};
export var DangerButtonAnchor = function (props) {
    var theme = useTheme();
    return React.createElement(DangerStyleButtonAnchor, __assign({ themes: theme }, props));
};
var dangerStyle = css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var palette = themes.palette, interaction = themes.interaction;
    return css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      color: #fff;\n      border: none;\n      background-color: ", ";\n      color: #fff;\n      transition: ", ";\n\n      &.hover {\n        background-color: ", ";\n      }\n\n      &[disabled] {\n        background-color: ", ";\n        color: ", ";\n      }\n    "], ["\n      color: #fff;\n      border: none;\n      background-color: ", ";\n      color: #fff;\n      transition: ", ";\n\n      &.hover {\n        background-color: ", ";\n      }\n\n      &[disabled] {\n        background-color: ", ";\n        color: ", ";\n      }\n    "])), palette.DANGER, isTouchDevice ? 'none' : "all " + interaction.hover.animation, palette.hoverColor(palette.DANGER), palette.disableColor(palette.DANGER), palette.disableColor('#fff'));
});
var DangerStyleButton = styled(BaseButton)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  ", "\n"], ["\n  ", "\n"])), dangerStyle);
var DangerStyleButtonAnchor = styled(BaseButtonAnchor)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", "\n"], ["\n  ", "\n"])), dangerStyle);
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=DangerButton.js.map