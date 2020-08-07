var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React, { createContext, useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { getContentBoxStyle } from './dropdownHelper';
import { DropdownCloser } from './DropdownCloser';
export var DropdownContentInnerContext = createContext({
    maxHeight: '',
});
export var DropdownContentInner = function (_a) {
    var triggerRect = _a.triggerRect, scrollable = _a.scrollable, children = _a.children, className = _a.className, controllable = _a.controllable;
    var theme = useTheme();
    var _b = useState(false), isMounted = _b[0], setIsMounted = _b[1];
    var _c = useState(false), isActive = _c[0], setIsActive = _c[1];
    var _d = useState({
        top: '0',
        left: '0',
        maxHeight: '',
    }), contentBox = _d[0], setContentBox = _d[1];
    var wrapperRef = useRef(null);
    useEffect(function () {
        setIsMounted(true);
    }, []);
    useEffect(function () {
        if (isMounted && wrapperRef.current) {
            setContentBox(getContentBoxStyle(triggerRect, {
                width: wrapperRef.current.offsetWidth,
                height: wrapperRef.current.offsetHeight,
            }, {
                width: innerWidth,
                height: innerHeight,
            }, {
                top: pageYOffset,
                left: pageXOffset,
            }));
            setIsActive(true);
        }
    }, [isMounted, triggerRect]);
    return (React.createElement(Wrapper, { ref: wrapperRef, contentBox: contentBox, scrollable: scrollable, className: className + " " + (isActive ? 'active' : ''), controllable: controllable, themes: theme }, controllable ? (children) : (React.createElement(DropdownContentInnerContext.Provider, { value: { maxHeight: contentBox.maxHeight } },
        React.createElement(DropdownCloser, null, children)))));
};
var Wrapper = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var contentBox = _a.contentBox, themes = _a.themes, scrollable = _a.scrollable, controllable = _a.controllable;
    return css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      visibility: hidden;\n      z-index: 99999;\n      position: absolute;\n      top: ", ";\n      left: ", ";\n      border-radius: ", ";\n      box-shadow: 0 4px 10px 0 rgba(51, 51, 51, 0.3);\n      background-color: #fff;\n      white-space: nowrap;\n\n      ", "\n\n      ", "\n\n      &.active {\n        visibility: visible;\n      }\n    "], ["\n      visibility: hidden;\n      z-index: 99999;\n      position: absolute;\n      top: ", ";\n      left: ", ";\n      border-radius: ", ";\n      box-shadow: 0 4px 10px 0 rgba(51, 51, 51, 0.3);\n      background-color: #fff;\n      white-space: nowrap;\n\n      ",
        "\n\n      ",
        "\n\n      &.active {\n        visibility: visible;\n      }\n    "])), contentBox.top, contentBox.left, themes.frame.border.radius.m, controllable
        ? "\n          display: flex;\n          flex-direction: column;\n          "
        : '', contentBox.maxHeight && scrollable && controllable
        ? "\n          max-height: " + contentBox.maxHeight + ";\n          "
        : '');
});
var templateObject_1, templateObject_2;
//# sourceMappingURL=DropdownContentInner.js.map