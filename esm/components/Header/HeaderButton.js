var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled, { css } from 'styled-components';
import { Icon } from '../Icon/Icon';
import { useTheme } from '../../hooks/useTheme';
export var HeaderButton = function (_a) {
    var icon = _a.icon, children = _a.children, onClick = _a.onClick;
    var theme = useTheme();
    return (React.createElement(Wrapper, { themes: theme, onClick: onClick },
        icon && (React.createElement(IconWrapper, { themes: theme, role: "presentation" },
            React.createElement(Icon, { name: icon }))),
        children));
};
var Wrapper = styled.button(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size, interaction = themes.interaction;
    return css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      display: inline-block;\n      margin: 0;\n      padding: 0 ", ";\n      border: none;\n      background: none;\n      color: #fff;\n      font-size: ", ";\n      line-height: 50px;\n      transition: background-color ", ";\n      cursor: pointer;\n\n      &:hover {\n        background-color: rgba(255, 255, 255, 0.3);\n      }\n    "], ["\n      display: inline-block;\n      margin: 0;\n      padding: 0 ", ";\n      border: none;\n      background: none;\n      color: #fff;\n      font-size: ", ";\n      line-height: 50px;\n      transition: background-color ", ";\n      cursor: pointer;\n\n      &:hover {\n        background-color: rgba(255, 255, 255, 0.3);\n      }\n    "])), size.pxToRem(10), size.pxToRem(size.font.TALL), interaction.hover.animation);
});
var IconWrapper = styled.figure(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size;
    return css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      display: inline-block;\n      padding: 0;\n      margin: 0 ", " 0 0;\n      vertical-align: middle;\n    "], ["\n      display: inline-block;\n      padding: 0;\n      margin: 0 ", " 0 0;\n      vertical-align: middle;\n    "])), size.pxToRem(size.space.XXS));
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=HeaderButton.js.map