"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarkTooltip = exports.LightTooltip = void 0;
var react_1 = __importStar(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var Balloon_1 = require("../Balloon");
var useTheme_1 = require("../../hooks/useTheme");
var tooltipFactory = function (balloonTheme) { return function (_a) {
    var message = _a.message, children = _a.children, triggerType = _a.triggerType, multiLine = _a.multiLine, _b = _a.ellipsisOnly, ellipsisOnly = _b === void 0 ? false : _b, _c = _a.horizontal, horizontal = _c === void 0 ? 'left' : _c, _d = _a.vertical, vertical = _d === void 0 ? 'bottom' : _d;
    var themes = useTheme_1.useTheme();
    var _e = react_1.useState(false), isVisible = _e[0], setIsVisible = _e[1];
    var className = [triggerType === 'icon' ? 'icon-tooltip' : '', multiLine ? 'multi-line' : '']
        .filter(function (c) { return !!c; })
        .join(' ');
    var ref = react_1.default.createRef();
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
    return (react_1.default.createElement(Wrapper, { ref: ref, onMouseOver: overAction, onTouchStart: overAction, onFocus: overAction, onMouseOut: outAction, onTouchEnd: outAction, onBlur: outAction, tabIndex: 0 },
        isVisible && (react_1.default.createElement(StyledBalloon, { horizontal: horizontal, vertical: vertical, className: className },
            react_1.default.createElement(StyledBalloonText, { themes: themes }, message))),
        children));
}; };
exports.LightTooltip = tooltipFactory('light');
exports.DarkTooltip = tooltipFactory('dark');
var Wrapper = styled_components_1.default.span(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: relative;\n  display: inline-block;\n  max-width: 100%;\n"], ["\n  position: relative;\n  display: inline-block;\n  max-width: 100%;\n"])));
var StyledLightBalloon = styled_components_1.default(Balloon_1.LightBalloon)(templateObject_18 || (templateObject_18 = __makeTemplateObject(["\n  position: absolute;\n  z-index: 9000;\n\n  &.multi-line {\n    max-width: 100%;\n    white-space: normal;\n  }\n\n  ", "\n\n  &.icon-tooltip {\n    ", "\n  }\n"], ["\n  position: absolute;\n  z-index: 9000;\n\n  &.multi-line {\n    max-width: 100%;\n    white-space: normal;\n  }\n\n  ",
    "\n\n  &.icon-tooltip {\n    ",
    "\n  }\n"])), function (_a) {
    var horizontal = _a.horizontal, vertical = _a.vertical;
    switch (horizontal) {
        case 'left':
            switch (vertical) {
                case 'bottom':
                    return styled_components_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n              left: 0;\n              bottom: calc(100% + 10px);\n            "], ["\n              left: 0;\n              bottom: calc(100% + 10px);\n            "])));
                case 'middle':
                    return styled_components_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n              left: calc(100% + 10px);\n              top: 50%;\n              transform: translate(0, -50%);\n            "], ["\n              left: calc(100% + 10px);\n              top: 50%;\n              transform: translate(0, -50%);\n            "])));
                case 'top':
                    return styled_components_1.css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n              left: 0;\n              top: calc(100% + 10px);\n            "], ["\n              left: 0;\n              top: calc(100% + 10px);\n            "])));
            }
            break;
        case 'center':
            switch (vertical) {
                case 'bottom':
                    return styled_components_1.css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n              left: 50%;\n              bottom: calc(100% + 10px);\n              transform: translate(-50%, 0);\n            "], ["\n              left: 50%;\n              bottom: calc(100% + 10px);\n              transform: translate(-50%, 0);\n            "])));
                case 'top':
                    return styled_components_1.css(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n              left: 50%;\n              top: calc(100% + 10px);\n              transform: translate(-50%, 0);\n            "], ["\n              left: 50%;\n              top: calc(100% + 10px);\n              transform: translate(-50%, 0);\n            "])));
            }
            break;
        case 'right':
            switch (vertical) {
                case 'bottom':
                    return styled_components_1.css(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n              right: 0;\n              bottom: calc(100% + 10px);\n            "], ["\n              right: 0;\n              bottom: calc(100% + 10px);\n            "])));
                case 'middle':
                    return styled_components_1.css(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n              right: calc(100% + 10px);\n              top: 50%;\n              transform: translate(0, -50%);\n            "], ["\n              right: calc(100% + 10px);\n              top: 50%;\n              transform: translate(0, -50%);\n            "])));
                case 'top':
                    return styled_components_1.css(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n              right: 0;\n              top: calc(100% + 10px);\n            "], ["\n              right: 0;\n              top: calc(100% + 10px);\n            "])));
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
                    return styled_components_1.css(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n                left: 50%;\n                bottom: calc(100% + 10px);\n                transform: translate(-29px, 0);\n              "], ["\n                left: 50%;\n                bottom: calc(100% + 10px);\n                transform: translate(-29px, 0);\n              "])));
                case 'middle':
                    return styled_components_1.css(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n                left: calc(100% + 10px);\n                top: calc(50% - 2px);\n                transform: translate(0, -50%);\n              "], ["\n                left: calc(100% + 10px);\n                top: calc(50% - 2px);\n                transform: translate(0, -50%);\n              "])));
                case 'top':
                    return styled_components_1.css(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n                left: 50%;\n                top: calc(100% + 10px);\n                transform: translate(-29px, 0);\n              "], ["\n                left: 50%;\n                top: calc(100% + 10px);\n                transform: translate(-29px, 0);\n              "])));
            }
            break;
        case 'center':
            switch (vertical) {
                case 'bottom':
                    return styled_components_1.css(templateObject_13 || (templateObject_13 = __makeTemplateObject(["\n                left: 50%;\n                bottom: calc(100% + 10px);\n                transform: translate(-50%, 0);\n              "], ["\n                left: 50%;\n                bottom: calc(100% + 10px);\n                transform: translate(-50%, 0);\n              "])));
                case 'top':
                    return styled_components_1.css(templateObject_14 || (templateObject_14 = __makeTemplateObject(["\n                left: 50%;\n                top: calc(100% + 10px);\n                transform: translate(-50%, 0);\n              "], ["\n                left: 50%;\n                top: calc(100% + 10px);\n                transform: translate(-50%, 0);\n              "])));
            }
            break;
        case 'right':
            switch (vertical) {
                case 'bottom':
                    return styled_components_1.css(templateObject_15 || (templateObject_15 = __makeTemplateObject(["\n                right: 50%;\n                bottom: calc(100% + 10px);\n                transform: translate(29px, 0);\n              "], ["\n                right: 50%;\n                bottom: calc(100% + 10px);\n                transform: translate(29px, 0);\n              "])));
                case 'middle':
                    return styled_components_1.css(templateObject_16 || (templateObject_16 = __makeTemplateObject(["\n                right: calc(100% + 10px);\n                top: calc(50% - 2px);\n                transform: translate(0, -50%);\n              "], ["\n                right: calc(100% + 10px);\n                top: calc(50% - 2px);\n                transform: translate(0, -50%);\n              "])));
                case 'top':
                    return styled_components_1.css(templateObject_17 || (templateObject_17 = __makeTemplateObject(["\n                right: 0;\n                top: calc(100% + 10px);\n                transform: translate(19px, 0);\n              "], ["\n                right: 0;\n                top: calc(100% + 10px);\n                transform: translate(19px, 0);\n              "])));
            }
            break;
    }
    return '';
});
var StyledDarkBalloon = StyledLightBalloon.withComponent(Balloon_1.DarkBalloon);
var StyledBalloonText = styled_components_1.default.p(templateObject_20 || (templateObject_20 = __makeTemplateObject(["\n  margin: 0;\n  ", "\n"], ["\n  margin: 0;\n  ",
    "\n"])), function (props) {
    var themes = props.themes;
    var size = themes.size;
    return styled_components_1.css(templateObject_19 || (templateObject_19 = __makeTemplateObject(["\n      padding: ", " ", ";\n    "], ["\n      padding: ", " ", ";\n    "])), size.pxToRem(size.space.XXS), size.pxToRem(size.space.XS));
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20;
//# sourceMappingURL=Tooltip.js.map