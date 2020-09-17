var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled, { css } from 'styled-components';
import { DarkBalloon, LightBalloon } from '../Balloon';
import { TooltipPortal } from './TooltipPortal';
import { useTheme } from '../../hooks/useTheme';
import { useId } from '../../hooks/useId';
var tooltipFactory = function (balloonTheme) { return function (_a) {
    var message = _a.message, children = _a.children, triggerType = _a.triggerType, multiLine = _a.multiLine, _b = _a.ellipsisOnly, ellipsisOnly = _b === void 0 ? false : _b, _c = _a.horizontal, horizontal = _c === void 0 ? 'left' : _c, _d = _a.vertical, vertical = _d === void 0 ? 'bottom' : _d;
    var themes = useTheme();
    var _e = useState(false), isVisible = _e[0], setIsVisible = _e[1];
    var _f = useState(null), rect = _f[0], setRect = _f[1];
    var ref = React.createRef();
    var tooltipId = useId();
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
        if (ref.current) {
            setRect(ref.current.getBoundingClientRect());
        }
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
    var isIcon = triggerType === 'icon';
    var portalRoot = useRef(document.createElement('div')).current;
    useEffect(function () {
        document.body.appendChild(portalRoot);
        return function () {
            document.body.removeChild(portalRoot);
        };
    }, [portalRoot]);
    return (React.createElement(Wrapper, { "aria-describedby": isVisible ? tooltipId : undefined, ref: ref, onMouseEnter: overAction, onTouchStart: overAction, onFocus: overAction, onMouseLeave: outAction, onTouchEnd: outAction, onBlur: outAction, tabIndex: 0, isIcon: isIcon },
        isVisible &&
            rect &&
            createPortal(React.createElement(TooltipPortal, { id: tooltipId, parentRect: rect, isIcon: isIcon, isMultiLine: multiLine, horizontal: horizontal, vertical: vertical },
                React.createElement(StyledBalloon, { horizontal: horizontal, vertical: vertical, isMultiLine: multiLine },
                    React.createElement(StyledBalloonText, { themes: themes }, message))), portalRoot),
        children));
}; };
export var LightTooltip = tooltipFactory('light');
export var DarkTooltip = tooltipFactory('dark');
var Wrapper = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: inline-block;\n  max-width: 100%;\n  ", "\n"], ["\n  display: inline-block;\n  max-width: 100%;\n  ",
    "\n"])), function (_a) {
    var isIcon = _a.isIcon;
    return isIcon && css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      line-height: 0;\n    "], ["\n      line-height: 0;\n    "])));
});
var StyledLightBalloon = styled(LightBalloon)(function (_a) {
    var isMultiLine = _a.isMultiLine;
    return isMultiLine && css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      max-width: 100%;\n      white-space: normal;\n    "], ["\n      max-width: 100%;\n      white-space: normal;\n    "])));
});
var StyledDarkBalloon = StyledLightBalloon.withComponent(DarkBalloon);
var StyledBalloonText = styled.p(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  margin: 0;\n  ", "\n"], ["\n  margin: 0;\n  ",
    "\n"])), function (props) {
    var themes = props.themes;
    var size = themes.size;
    return css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      padding: ", " ", ";\n    "], ["\n      padding: ", " ", ";\n    "])), size.pxToRem(size.space.XXS), size.pxToRem(size.space.XS));
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=Tooltip.js.map