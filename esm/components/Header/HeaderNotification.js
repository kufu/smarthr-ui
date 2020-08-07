var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
export var HeaderNotification = function (_a) {
    var length = _a.length, onClick = _a.onClick;
    var theme = useTheme();
    return (React.createElement(Wrapper, { themes: theme },
        React.createElement(Button, { isZero: length === 0, onClick: onClick, "aria-label": "\u901A\u77E5\u5C65\u6B74", themes: theme }, length >= 10 ? '9+' : length)));
};
var Wrapper = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var pxToRem = themes.size.pxToRem;
    return css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      display: flex;\n      align-items: center;\n      padding: 0 ", ";\n    "], ["\n      display: flex;\n      align-items: center;\n      padding: 0 ", ";\n    "])), pxToRem(10));
});
var Button = styled.button(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes, isZero = _a.isZero;
    var size = themes.size, interaction = themes.interaction;
    return css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      display: inline-block;\n      width: 29px;\n      height: 29px;\n      padding: 0;\n      border: none;\n      border-radius: 4px;\n      background-color: ", ";\n      color: #fff;\n      font-size: ", ";\n      transition: background-color ", ";\n      cursor: pointer;\n\n      &:hover {\n        background-color: ", ";\n      }\n    "], ["\n      display: inline-block;\n      width: 29px;\n      height: 29px;\n      padding: 0;\n      border: none;\n      border-radius: 4px;\n      background-color: ", ";\n      color: #fff;\n      font-size: ", ";\n      transition: background-color ", ";\n      cursor: pointer;\n\n      &:hover {\n        background-color: ", ";\n      }\n    "])), isZero ? '#aaa' : '#fcb156', size.pxToRem(size.font.TALL), interaction.hover.animation, isZero ? '#aaa' : '#ffc77b');
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=HeaderNotification.js.map