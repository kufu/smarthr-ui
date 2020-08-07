var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled, { css } from 'styled-components';
import { Icon } from '../Icon';
import { useTheme } from '../../hooks/useTheme';
export var TertiaryLink = function (_a) {
    var text = _a.text, iconName = _a.iconName, onClick = _a.onClick;
    var theme = useTheme();
    return (React.createElement(Button, { onClick: onClick, themes: theme },
        iconName && React.createElement(Icon, { size: 14, name: iconName }),
        React.createElement(Text, { themes: theme }, text)));
};
var resetButtonStyle = css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background-color: transparent;\n  border: none;\n  padding: 0;\n  appearance: none;\n"], ["\n  background-color: transparent;\n  border: none;\n  padding: 0;\n  appearance: none;\n"])));
var Button = styled.button(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  ", "\n  ", "\n"], ["\n  ", "\n  ",
    "\n"])), resetButtonStyle, function (_a) {
    var themes = _a.themes;
    var pxToRem = themes.size.pxToRem;
    return css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      color: #007bc2;\n      display: flex;\n      align-items: center;\n\n      &:hover {\n        text-decoration: underline;\n        cursor: pointer;\n      }\n\n      > svg {\n        margin-right: ", ";\n      }\n    "], ["\n      color: #007bc2;\n      display: flex;\n      align-items: center;\n\n      &:hover {\n        text-decoration: underline;\n        cursor: pointer;\n      }\n\n      > svg {\n        margin-right: ", ";\n      }\n    "])), pxToRem(4));
});
var Text = styled.p(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, font = _b.font;
    return css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      margin: 0px;\n      font-size: ", ";\n    "], ["\n      margin: 0px;\n      font-size: ", ";\n    "])), pxToRem(font.GRANDE));
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=TertiaryLink.js.map