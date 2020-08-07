var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { DarkBalloon, LightBalloon } from '../Balloon';
import { useTheme } from '../../hooks/useTheme';
var tooltipFactory = function (balloonTheme) { return function (_a) {
    var message = _a.message, children = _a.children, triggerType = _a.triggerType, multiLine = _a.multiLine, _b = _a.ellipsisOnly, ellipsisOnly = _b === void 0 ? false : _b, _c = _a.horizontal, horizontal = _c === void 0 ? 'left' : _c, _d = _a.vertical, vertical = _d === void 0 ? 'bottom' : _d;
    var themes = useTheme();
    var _e = useState(false), isVisible = _e[0], setIsVisible = _e[1];
    var className = [triggerType === 'icon' ? 'icon-tooltip' : '', multiLine ? 'multi-line' : '']
        .filter(function (c) { return !!c; })
        .join(' ');
    var ref = React.createRef();
    var getBalloonWrapperWidth = function () {
        if (!ref.current) {
            return 0;
        }
        return ref.current.clientWidth;
    };
    var getParentWidth = function () {
        if (!ref.current) {
            return 0;
        }
        return parseInt(window.getComputedStyle(ref.current.parentNode, null).width.match(/\d+/)[0], 10);
    };
    var overAction = function () {
        if (!ellipsisOnly) {
            setIsVisible(true);
            return;
        }
        var parentWidth = getParentWidth();
        if (parentWidth < 0 || parentWidth > getBalloonWrapperWidth()) {
            return;
        }
        setIsVisible(true);
    };
    var outAction = function () {
        setIsVisible(false);
    };
    var StyledBalloon = balloonTheme === 'light' ? StyledLightBalloon : StyledDarkBalloon;
    return (React.createElement(Wrapper, { ref: ref, onMouseOver: overAction, onTouchStart: overAction, onFocus: overAction, onMouseOut: outAction, onTouchEnd: outAction, onBlur: outAction, tabIndex: 0 },
        isVisible && (React.createElement(StyledBalloon, { horizontal: horizontal, vertical: vertical, className: className },
            React.createElement(StyledBalloonText, { themes: themes }, message))),
        children));
}; };
export var LightTooltip = tooltipFactory('light');
export var DarkTooltip = tooltipFactory('dark');
var Wrapper = styled.span(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: relative;\n  display: inline-block;\n  max-width: 100%;\n"], ["\n  position: relative;\n  display: inline-block;\n  max-width: 100%;\n"])));
var StyledLightBalloon = styled(LightBalloon)(templateObject_18 || (templateObject_18 = __makeTemplateObject(["\n  position: absolute;\n  z-index: 9000;\n\n  &.multi-line {\n    max-width: 100%;\n    white-space: normal;\n  }\n\n  ", "\n\n  &.icon-tooltip {\n    ", "\n  }\n"], ["\n  position: absolute;\n  z-index: 9000;\n\n  &.multi-line {\n    max-width: 100%;\n    white-space: normal;\n  }\n\n  ",
    "\n\n  &.icon-tooltip {\n    ",
    "\n  }\n"])), function (_a) {
    var horizontal = _a.horizontal, vertical = _a.vertical;
    switch (horizontal) {
        case 'left':
            switch (vertical) {
                case 'bottom':
                    return css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n              left: 0;\n              bottom: calc(100% + 10px);\n            "], ["\n              left: 0;\n              bottom: calc(100% + 10px);\n            "])));
                case 'middle':
                    return css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n              left: calc(100% + 10px);\n              top: 50%;\n              transform: translate(0, -50%);\n            "], ["\n              left: calc(100% + 10px);\n              top: 50%;\n              transform: translate(0, -50%);\n            "])));
                case 'top':
                    return css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n              left: 0;\n              top: calc(100% + 10px);\n            "], ["\n              left: 0;\n              top: calc(100% + 10px);\n            "])));
            }
            break;
        case 'center':
            switch (vertical) {
                case 'bottom':
                    return css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n              left: 50%;\n              bottom: calc(100% + 10px);\n              transform: translate(-50%, 0);\n            "], ["\n              left: 50%;\n              bottom: calc(100% + 10px);\n              transform: translate(-50%, 0);\n            "])));
                case 'top':
                    return css(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n              left: 50%;\n              top: calc(100% + 10px);\n              transform: translate(-50%, 0);\n            "], ["\n              left: 50%;\n              top: calc(100% + 10px);\n              transform: translate(-50%, 0);\n            "])));
            }
            break;
        case 'right':
            switch (vertical) {
                case 'bottom':
                    return css(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n              right: 0;\n              bottom: calc(100% + 10px);\n            "], ["\n              right: 0;\n              bottom: calc(100% + 10px);\n            "])));
                case 'middle':
                    return css(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n              right: calc(100% + 10px);\n              top: 50%;\n              transform: translate(0, -50%);\n            "], ["\n              right: calc(100% + 10px);\n              top: 50%;\n              transform: translate(0, -50%);\n            "])));
                case 'top':
                    return css(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n              right: 0;\n              top: calc(100% + 10px);\n            "], ["\n              right: 0;\n              top: calc(100% + 10px);\n            "])));
            }
            break;
    }
    return '';
}, function (_a) {
    var horizontal = _a.horizontal, vertical = _a.vertical;
    switch (horizontal) {
        case 'left':
            switch (vertical) {
                case 'bottom':
                    return css(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n                left: 50%;\n                bottom: calc(100% + 10px);\n                transform: translate(-29px, 0);\n              "], ["\n                left: 50%;\n                bottom: calc(100% + 10px);\n                transform: translate(-29px, 0);\n              "])));
                case 'middle':
                    return css(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n                left: calc(100% + 10px);\n                top: calc(50% - 2px);\n                transform: translate(0, -50%);\n              "], ["\n                left: calc(100% + 10px);\n                top: calc(50% - 2px);\n                transform: translate(0, -50%);\n              "])));
                case 'top':
                    return css(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n                left: 50%;\n                top: calc(100% + 10px);\n                transform: translate(-29px, 0);\n              "], ["\n                left: 50%;\n                top: calc(100% + 10px);\n                transform: translate(-29px, 0);\n              "])));
            }
            break;
        case 'center':
            switch (vertical) {
                case 'bottom':
                    return css(templateObject_13 || (templateObject_13 = __makeTemplateObject(["\n                left: 50%;\n                bottom: calc(100% + 10px);\n                transform: translate(-50%, 0);\n              "], ["\n                left: 50%;\n                bottom: calc(100% + 10px);\n                transform: translate(-50%, 0);\n              "])));
                case 'top':
                    return css(templateObject_14 || (templateObject_14 = __makeTemplateObject(["\n                left: 50%;\n                top: calc(100% + 10px);\n                transform: translate(-50%, 0);\n              "], ["\n                left: 50%;\n                top: calc(100% + 10px);\n                transform: translate(-50%, 0);\n              "])));
            }
            break;
        case 'right':
            switch (vertical) {
                case 'bottom':
                    return css(templateObject_15 || (templateObject_15 = __makeTemplateObject(["\n                right: 50%;\n                bottom: calc(100% + 10px);\n                transform: translate(29px, 0);\n              "], ["\n                right: 50%;\n                bottom: calc(100% + 10px);\n                transform: translate(29px, 0);\n              "])));
                case 'middle':
                    return css(templateObject_16 || (templateObject_16 = __makeTemplateObject(["\n                right: calc(100% + 10px);\n                top: calc(50% - 2px);\n                transform: translate(0, -50%);\n              "], ["\n                right: calc(100% + 10px);\n                top: calc(50% - 2px);\n                transform: translate(0, -50%);\n              "])));
                case 'top':
                    return css(templateObject_17 || (templateObject_17 = __makeTemplateObject(["\n                right: 0;\n                top: calc(100% + 10px);\n                transform: translate(19px, 0);\n              "], ["\n                right: 0;\n                top: calc(100% + 10px);\n                transform: translate(19px, 0);\n              "])));
            }
            break;
    }
    return '';
});
var StyledDarkBalloon = StyledLightBalloon.withComponent(DarkBalloon);
var StyledBalloonText = styled.p(templateObject_20 || (templateObject_20 = __makeTemplateObject(["\n  margin: 0;\n  ", "\n"], ["\n  margin: 0;\n  ",
    "\n"])), function (props) {
    var themes = props.themes;
    var size = themes.size;
    return css(templateObject_19 || (templateObject_19 = __makeTemplateObject(["\n      padding: ", " ", ";\n    "], ["\n      padding: ", " ", ";\n    "])), size.pxToRem(size.space.XXS), size.pxToRem(size.space.XS));
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20;
//# sourceMappingURL=Tooltip.js.map