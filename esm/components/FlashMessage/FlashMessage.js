var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React, { useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { Icon } from '../Icon';
import { SecondaryButton } from '../Button';
var REMOVE_DELAY = 8000;
var timerId = 0;
export var FlashMessage = function (_a) {
    var visible = _a.visible, type = _a.type, text = _a.text, onClose = _a.onClose, _b = _a.className, className = _b === void 0 ? '' : _b;
    var theme = useTheme();
    useEffect(function () {
        if (visible) {
            timerId = setTimeout(onClose, REMOVE_DELAY);
        }
        else {
            clearTimeout(timerId);
        }
        return function () {
            clearTimeout(timerId);
        };
    }, [onClose, visible]);
    if (!visible)
        return null;
    var iconName = 'fa-check-circle';
    var iconColor = theme.palette.TEXT_GREY;
    switch (type) {
        case 'success':
            iconName = 'fa-check-circle';
            iconColor = theme.palette.MAIN;
            break;
        case 'info':
            iconName = 'fa-info-circle';
            iconColor = theme.palette.TEXT_GREY;
            break;
        case 'warning':
            iconName = 'fa-exclamation-triangle';
            iconColor = theme.palette.WARNING;
            break;
        case 'error':
            iconName = 'fa-exclamation-circle';
            iconColor = theme.palette.DANGER;
    }
    return (React.createElement(Wrapper, { className: type + " " + className, themes: theme },
        React.createElement(Icon, { name: iconName, size: 14, color: iconColor }),
        React.createElement(Txt, { themes: theme }, text),
        React.createElement(CloseButton, { className: "close", onClick: onClose, size: "s", square: true, themes: theme },
            React.createElement(Icon, { size: 16, name: "fa-times" }))));
};
var bounceAnimation = keyframes(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  from,\n  20%,\n  53%,\n  80%,\n  to {\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n    transform: translate3d(0, 0, 0);\n  }\n  40%,\n  43% {\n    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);\n    transform: translate3d(0, -30px, 0);\n  }\n  70% {\n    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);\n    transform: translate3d(0, -15px, 0);\n  }\n  90% {\n    transform: translate3d(0, -4px, 0);\n  }\n"], ["\n  from,\n  20%,\n  53%,\n  80%,\n  to {\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n    transform: translate3d(0, 0, 0);\n  }\n  40%,\n  43% {\n    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);\n    transform: translate3d(0, -30px, 0);\n  }\n  70% {\n    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);\n    transform: translate3d(0, -15px, 0);\n  }\n  90% {\n    transform: translate3d(0, -4px, 0);\n  }\n"])));
var Wrapper = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size, frame = themes.frame, palette = themes.palette;
    return css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      z-index: 1000;\n      display: flex;\n      position: fixed;\n      bottom: ", ";\n      left: ", ";\n      box-sizing: border-box;\n      align-items: center;\n      min-width: ", ";\n      padding: ", ";\n      padding-right: ", ";\n      background-color: #fff;\n      border: 1px solid ", ";\n      border-radius: ", ";\n      box-shadow: 0 4px 10px 0 rgba(51, 51, 51, 0.3);\n      animation: ", " 1s 0s both;\n    "], ["\n      z-index: 1000;\n      display: flex;\n      position: fixed;\n      bottom: ", ";\n      left: ", ";\n      box-sizing: border-box;\n      align-items: center;\n      min-width: ", ";\n      padding: ", ";\n      padding-right: ", ";\n      background-color: #fff;\n      border: 1px solid ", ";\n      border-radius: ", ";\n      box-shadow: 0 4px 10px 0 rgba(51, 51, 51, 0.3);\n      animation: ", " 1s 0s both;\n    "])), size.pxToRem(size.space.XXS), size.pxToRem(size.space.XXS), size.pxToRem(200), size.pxToRem(size.space.XS), size.pxToRem(54), palette.BORDER, frame.border.radius.m, bounceAnimation);
});
var CloseButton = styled(SecondaryButton)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space;
    return css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      position: absolute;\n      top: 50%;\n      right: ", ";\n      transform: translateY(-50%);\n    "], ["\n      position: absolute;\n      top: 50%;\n      right: ", ";\n      transform: translateY(-50%);\n    "])), pxToRem(space.XXS));
});
var Txt = styled.p(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space, font = _b.font;
    return css(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n      flex-grow: 1;\n      flex-shrink: 1;\n      padding: 0;\n      margin: 0 0 0 ", ";\n      font-size: ", ";\n      line-height: 1;\n    "], ["\n      flex-grow: 1;\n      flex-shrink: 1;\n      padding: 0;\n      margin: 0 0 0 ", ";\n      font-size: ", ";\n      line-height: 1;\n    "])), pxToRem(space.XXS), pxToRem(font.TALL));
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=FlashMessage.js.map