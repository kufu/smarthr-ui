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
import React, { useLayoutEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { getTooltipRect } from './tooltipHelper';
export var TooltipPortal = function (_a) {
    var id = _a.id, parentRect = _a.parentRect, children = _a.children, _b = _a.isIcon, isIcon = _b === void 0 ? false : _b, _c = _a.isMultiLine, isMultiLine = _c === void 0 ? false : _c, horizontal = _a.horizontal, vertical = _a.vertical;
    var portalRef = useRef(null);
    var _d = useState({
        top: 0,
        left: 0,
        width: isMultiLine ? parentRect.width : 0,
        height: 0,
    }), rect = _d[0], setRect = _d[1];
    useLayoutEffect(function () {
        if (!portalRef.current) {
            return;
        }
        var _a = portalRef.current, offsetWidth = _a.offsetWidth, offsetHeight = _a.offsetHeight;
        setRect(getTooltipRect({
            parentRect: parentRect,
            tooltipSize: {
                width: offsetWidth,
                height: offsetHeight,
            },
            vertical: vertical,
            horizontal: horizontal,
            isMultiLine: isMultiLine,
            isIcon: isIcon,
            outerMargin: 10,
        }));
    }, [horizontal, isIcon, isMultiLine, parentRect, vertical]);
    return (React.createElement(Container, __assign({ id: id, ref: portalRef }, rect), children));
};
var Container = styled.div(function (_a) {
    var top = _a.top, left = _a.left, width = _a.width, height = _a.height;
    return css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    position: absolute;\n    top: ", "px;\n    left: ", "px;\n    ", "\n    ", "\n    z-index: 9000;\n  "], ["\n    position: absolute;\n    top: ", "px;\n    left: ", "px;\n    ",
        "\n    ",
        "\n    z-index: 9000;\n  "])), top, left, width > 0 && css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      width: ", "px;\n    "], ["\n      width: ", "px;\n    "])), width), height > 0 && css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      height: ", "px;\n    "], ["\n      height: ", "px;\n    "])), height));
});
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=TooltipPortal.js.map