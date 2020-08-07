var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { useOffsetHeight } from './dialogHelper';
import { SecondaryButton } from '../Button';
export var MessageDialogContentInner = function (_a) {
    var title = _a.title, description = _a.description, closeText = _a.closeText, onClickClose = _a.onClickClose;
    var theme = useTheme();
    var _b = useOffsetHeight(), offsetHeight = _b.offsetHeight, titleRef = _b.titleRef, bottomRef = _b.bottomRef;
    return (React.createElement(React.Fragment, null,
        React.createElement(Title, { themes: theme, ref: titleRef }, title),
        React.createElement(Description, { themes: theme, offsetHeight: offsetHeight }, description),
        React.createElement(Bottom, { themes: theme, ref: bottomRef },
            React.createElement(SecondaryButton, { onClick: onClickClose }, closeText))));
};
var Title = styled.p(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space, font = _b.font;
    return css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      margin: 0;\n      padding: ", " ", " ", ";\n      font-size: ", ";\n      line-height: 1;\n    "], ["\n      margin: 0;\n      padding: ", " ", " ", ";\n      font-size: ", ";\n      line-height: 1;\n    "])), pxToRem(space.XS), pxToRem(space.S), pxToRem(space.S), pxToRem(font.GRANDE));
});
var Description = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes, offsetHeight = _a.offsetHeight;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space, font = _b.font;
    return css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      max-height: calc(100vh - ", "px);\n      overflow: auto;\n      padding: 0 ", ";\n      font-size: ", ";\n      line-height: 1.5;\n    "], ["\n      max-height: calc(100vh - ", "px);\n      overflow: auto;\n      padding: 0 ", ";\n      font-size: ", ";\n      line-height: 1.5;\n    "])), offsetHeight, pxToRem(space.S), pxToRem(font.TALL));
});
var Bottom = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space;
    return css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n      display: flex;\n      justify-content: flex-end;\n      padding: ", " ", " ", ";\n    "], ["\n      display: flex;\n      justify-content: flex-end;\n      padding: ", " ", " ", ";\n    "])), pxToRem(space.S), pxToRem(space.S), pxToRem(space.XS));
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=MessageDialogContentInner.js.map