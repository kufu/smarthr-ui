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
export var SecondaryButton = function (props) {
    var theme = useTheme();
    return React.createElement(SecondaryStyleButton, __assign({ themes: theme }, props));
};
// set the displayName explicit.
// This is for error message of BottomFixedArea component.
SecondaryButton.displayName = 'SecondaryButton';
export var SecondaryButtonAnchor = function (props) {
    var theme = useTheme();
    return React.createElement(SecondaryStyleButtonAnchor, __assign({ themes: theme }, props));
};
// set the displayName explicit.
// This is for error message of BottomFixedArea component.
SecondaryButtonAnchor.displayName = 'SecondaryButtonAnchor';
var secondaryStyle = css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var palette = themes.palette, interaction = themes.interaction, frame = themes.frame;
    return css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      background-color: #fff;\n      color: ", ";\n      transition: ", ";\n      border: ", ";\n\n      &.hover {\n        background-color: ", ";\n      }\n\n      &[disabled] {\n        background-color: ", ";\n        color: ", ";\n      }\n    "], ["\n      background-color: #fff;\n      color: ", ";\n      transition: ", ";\n      border: ", ";\n\n      &.hover {\n        background-color: ", ";\n      }\n\n      &[disabled] {\n        background-color: ", ";\n        color: ", ";\n      }\n    "])), palette.TEXT_BLACK, isTouchDevice ? 'none' : "all " + interaction.hover.animation, frame.border.default, palette.hoverColor('#fff'), palette.COLUMN, palette.TEXT_DISABLED);
});
var SecondaryStyleButton = styled(BaseButton)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  ", "\n"], ["\n  ", "\n"])), secondaryStyle);
var SecondaryStyleButtonAnchor = styled(BaseButtonAnchor)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", "\n"], ["\n  ", "\n"])), secondaryStyle);
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=SecondaryButton.js.map