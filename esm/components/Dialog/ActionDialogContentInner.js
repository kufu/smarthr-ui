var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React, { useCallback } from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { useOffsetHeight } from './dialogHelper';
import { DangerButton, PrimaryButton, SecondaryButton } from '../Button';
export var ActionDialogContentInner = function (_a) {
    var children = _a.children, title = _a.title, closeText = _a.closeText, actionText = _a.actionText, actionTheme = _a.actionTheme, onClickAction = _a.onClickAction, onClickClose = _a.onClickClose, _b = _a.actionDisabled, actionDisabled = _b === void 0 ? false : _b;
    var theme = useTheme();
    var handleClickAction = useCallback(function () {
        onClickAction(onClickClose);
    }, [onClickAction, onClickClose]);
    var _c = useOffsetHeight(), offsetHeight = _c.offsetHeight, titleRef = _c.titleRef, bottomRef = _c.bottomRef;
    var ActionButton = PrimaryButton;
    if (actionTheme === 'secondary')
        ActionButton = SecondaryButton;
    if (actionTheme === 'danger')
        ActionButton = DangerButton;
    return (React.createElement(React.Fragment, null,
        React.createElement(Title, { themes: theme, ref: titleRef }, title),
        React.createElement(Body, { offsetHeight: offsetHeight }, children),
        React.createElement(Bottom, { themes: theme, ref: bottomRef },
            React.createElement(SecondaryButton, { onClick: onClickClose }, closeText),
            React.createElement(ActionButton, { onClick: handleClickAction, disabled: actionDisabled }, actionText))));
};
var Title = styled.p(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space, font = _b.font;
    var border = themes.frame.border;
    return css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      margin: 0;\n      padding: ", " ", ";\n      border-bottom: ", ";\n      font-size: ", ";\n      line-height: 1;\n    "], ["\n      margin: 0;\n      padding: ", " ", ";\n      border-bottom: ", ";\n      font-size: ", ";\n      line-height: 1;\n    "])), pxToRem(space.XS), pxToRem(space.S), border.default, pxToRem(font.GRANDE));
});
var Body = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var offsetHeight = _a.offsetHeight;
    return css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      max-height: calc(100vh - ", "px);\n      overflow: auto;\n    "], ["\n      max-height: calc(100vh - ", "px);\n      overflow: auto;\n    "])), offsetHeight);
});
var Bottom = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space;
    var border = themes.frame.border;
    return css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n      display: flex;\n      justify-content: flex-end;\n      margin: 0;\n      padding: ", " ", ";\n      border-top: ", ";\n\n      & > *:not(:first-child) {\n        margin: 0 0 0 ", ";\n      }\n    "], ["\n      display: flex;\n      justify-content: flex-end;\n      margin: 0;\n      padding: ", " ", ";\n      border-top: ", ";\n\n      & > *:not(:first-child) {\n        margin: 0 0 0 ", ";\n      }\n    "])), pxToRem(space.XS), pxToRem(space.S), border.default, pxToRem(space.XS));
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=ActionDialogContentInner.js.map