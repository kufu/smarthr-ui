var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { PrimaryButton, SecondaryButton } from '../Button';
export var SegmentedControl = function (_a) {
    var options = _a.options, value = _a.value, onClickOption = _a.onClickOption, _b = _a.size, size = _b === void 0 ? 'default' : _b, _c = _a.isSquare, isSquare = _c === void 0 ? false : _c, className = _a.className;
    var themes = useTheme();
    return (React.createElement(Container, { className: className }, options.map(function (option) {
        var isSelected = !!value && value === option.value;
        var Button = isSelected ? SelectedButton : DefaultButton;
        var onClick = onClickOption ? function () { return onClickOption(option.value); } : undefined;
        return (React.createElement(Button, { "aria-label": option.ariaLabel, key: option.value, disabled: option.disabled, onClick: onClick, size: size, square: isSquare, themes: themes }, option.content));
    })));
};
var Container = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: inline-flex;\n"], ["\n  display: inline-flex;\n"])));
var buttonStyle = css(function (_a) {
    var themes = _a.themes;
    var border = themes.frame.border;
    return css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    border: ", ";\n    border-radius: 0;\n\n    &:first-child {\n      border-top-left-radius: ", ";\n      border-bottom-left-radius: ", ";\n    }\n    &:last-child {\n      border-top-right-radius: ", ";\n      border-bottom-right-radius: ", ";\n    }\n    :not(:last-child) {\n      border-right-width: 0;\n    }\n  "], ["\n    border: ", ";\n    border-radius: 0;\n\n    &:first-child {\n      border-top-left-radius: ", ";\n      border-bottom-left-radius: ", ";\n    }\n    &:last-child {\n      border-top-right-radius: ", ";\n      border-bottom-right-radius: ", ";\n    }\n    :not(:last-child) {\n      border-right-width: 0;\n    }\n  "])), border.default, border.radius.m, border.radius.m, border.radius.m, border.radius.m);
});
var DefaultButton = styled(SecondaryButton)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  ", "\n"], ["\n  ", "\n"])), buttonStyle);
var SelectedButton = styled(PrimaryButton)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", "\n"], ["\n  ", "\n"])), buttonStyle);
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=SegmentedControl.js.map