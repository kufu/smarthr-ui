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
import React, { useRef } from 'react';
import styled, { createGlobalStyle, css } from 'styled-components';
import { CSSTransition } from 'react-transition-group';
import { useTheme } from '../../hooks/useTheme';
import { useHandleEscape } from '../../hooks/useHandleEscape';
import { DialogPositionProvider } from './DialogPositionProvider';
function exist(value) {
    return value !== undefined && value !== null;
}
export var DialogContentInner = function (_a) {
    var onClickOverlay = _a.onClickOverlay, _b = _a.onPressEscape, onPressEscape = _b === void 0 ? function () {
        /* noop */
    } : _b, isOpen = _a.isOpen, children = _a.children, props = __rest(_a, ["onClickOverlay", "onPressEscape", "isOpen", "children"]);
    var theme = useTheme();
    var domRef = useRef(null);
    useHandleEscape(onPressEscape);
    return (React.createElement(DialogPositionProvider, { top: props.top, bottom: props.bottom },
        React.createElement(CSSTransition, { nodeRef: domRef, className: "wrapper", classNames: "wrapper", in: isOpen, timeout: {
                appear: 500,
                enter: 300,
                exit: 300,
            }, appear: true, unmountOnExit: true },
            React.createElement(Wrapper, { ref: domRef },
                React.createElement(Background, { onClick: onClickOverlay, themes: theme }),
                React.createElement(Inner, __assign({ themes: theme }, props), children),
                React.createElement(ScrollSuppressing, null)))));
};
var Wrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  z-index: 10000;\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  &.wrapper-appear {\n    opacity: 0;\n  }\n  &.wrapper-appear-active {\n    transition: opacity 500ms;\n    opacity: 1;\n  }\n  &.wrapper-enter {\n    opacity: 0;\n  }\n  &.wrapper-enter-active {\n    transition: opacity 300ms;\n    opacity: 1;\n  }\n  &.wrapper-exit {\n    opacity: 1;\n  }\n  &.wrapper-exit-active {\n    transition: opacity 300ms;\n    opacity: 0;\n  }\n"], ["\n  z-index: 10000;\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  &.wrapper-appear {\n    opacity: 0;\n  }\n  &.wrapper-appear-active {\n    transition: opacity 500ms;\n    opacity: 1;\n  }\n  &.wrapper-enter {\n    opacity: 0;\n  }\n  &.wrapper-enter-active {\n    transition: opacity 300ms;\n    opacity: 1;\n  }\n  &.wrapper-exit {\n    opacity: 1;\n  }\n  &.wrapper-exit-active {\n    transition: opacity 300ms;\n    opacity: 0;\n  }\n"])));
var Inner = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes, top = _a.top, right = _a.right, bottom = _a.bottom, left = _a.left;
    var positionRight = exist(right) ? right + "px" : 'auto';
    var positionBottom = exist(bottom) ? bottom + "px" : 'auto';
    var positionTop = exist(top) ? top + "px" : 'auto';
    var positionLeft = exist(left) ? left + "px" : 'auto';
    var translateX = '0';
    var translateY = '0';
    if (top === undefined && bottom === undefined) {
        positionTop = '50%';
        translateY = '-50%';
    }
    if (right === undefined && left === undefined) {
        positionLeft = '50%';
        translateX = '-50%';
    }
    return css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      position: absolute;\n      z-index: 10100;\n      top: ", ";\n      right: ", ";\n      bottom: ", ";\n      left: ", ";\n      border-radius: ", ";\n      background-color: #fff;\n      box-shadow: 0 4px 10px 0 rgba(51, 51, 51, 0.3);\n      transform: translate(", ", ", ");\n    "], ["\n      position: absolute;\n      z-index: 10100;\n      top: ", ";\n      right: ", ";\n      bottom: ", ";\n      left: ", ";\n      border-radius: ", ";\n      background-color: #fff;\n      box-shadow: 0 4px 10px 0 rgba(51, 51, 51, 0.3);\n      transform: translate(", ", ", ");\n    "])), positionTop, positionRight, positionBottom, positionLeft, themes.frame.border.radius.l, translateX, translateY);
});
var Background = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    return css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      position: fixed;\n      top: 0;\n      left: 0;\n      width: 100%;\n      height: 100%;\n      background-color: ", ";\n    "], ["\n      position: fixed;\n      top: 0;\n      left: 0;\n      width: 100%;\n      height: 100%;\n      background-color: ", ";\n    "])), themes.palette.SCRIM);
});
var ScrollSuppressing = createGlobalStyle(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  body {\n    overflow: hidden;\n  }\n"], ["\n  body {\n    overflow: hidden;\n  }\n"])));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=DialogContentInner.js.map