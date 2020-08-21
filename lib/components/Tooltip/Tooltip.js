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
var react_dom_1 = require("react-dom");
var styled_components_1 = __importStar(require("styled-components"));
var Balloon_1 = require("../Balloon");
var TooltipPortal_1 = require("./TooltipPortal");
var useTheme_1 = require("../../hooks/useTheme");
var tooltipFactory = function (balloonTheme) { return function (_a) {
    var id = _a.id, message = _a.message, children = _a.children, triggerType = _a.triggerType, multiLine = _a.multiLine, _b = _a.ellipsisOnly, ellipsisOnly = _b === void 0 ? false : _b, _c = _a.horizontal, horizontal = _c === void 0 ? 'left' : _c, _d = _a.vertical, vertical = _d === void 0 ? 'bottom' : _d;
    var themes = useTheme_1.useTheme();
    var _e = react_1.useState(false), isVisible = _e[0], setIsVisible = _e[1];
    var _f = react_1.useState(null), rect = _f[0], setRect = _f[1];
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
    var portalRoot = react_1.useRef(document.createElement('div')).current;
    react_1.useEffect(function () {
        document.body.appendChild(portalRoot);
        return function () {
            document.body.removeChild(portalRoot);
        };
    }, [portalRoot]);
    return (react_1.default.createElement(Wrapper, { "aria-describedby": isVisible ? id : undefined, ref: ref, onMouseEnter: overAction, onTouchStart: overAction, onFocus: overAction, onMouseLeave: outAction, onTouchEnd: outAction, onBlur: outAction, tabIndex: 0, isIcon: isIcon },
        isVisible &&
            rect &&
            react_dom_1.createPortal(react_1.default.createElement(TooltipPortal_1.TooltipPortal, { id: id, parentRect: rect, isIcon: isIcon, isMultiLine: multiLine, horizontal: horizontal, vertical: vertical },
                react_1.default.createElement(StyledBalloon, { horizontal: horizontal, vertical: vertical, isMultiLine: multiLine },
                    react_1.default.createElement(StyledBalloonText, { themes: themes }, message))), portalRoot),
        children));
}; };
exports.LightTooltip = tooltipFactory('light');
exports.DarkTooltip = tooltipFactory('dark');
var Wrapper = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: inline-block;\n  max-width: 100%;\n  ", "\n"], ["\n  display: inline-block;\n  max-width: 100%;\n  ",
    "\n"])), function (_a) {
    var isIcon = _a.isIcon;
    return isIcon && styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      line-height: 0;\n    "], ["\n      line-height: 0;\n    "])));
});
var StyledLightBalloon = styled_components_1.default(Balloon_1.LightBalloon)(function (_a) {
    var isMultiLine = _a.isMultiLine;
    return isMultiLine && styled_components_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      max-width: 100%;\n      white-space: normal;\n    "], ["\n      max-width: 100%;\n      white-space: normal;\n    "])));
});
var StyledDarkBalloon = StyledLightBalloon.withComponent(Balloon_1.DarkBalloon);
var StyledBalloonText = styled_components_1.default.p(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  margin: 0;\n  ", "\n"], ["\n  margin: 0;\n  ",
    "\n"])), function (props) {
    var themes = props.themes;
    var size = themes.size;
    return styled_components_1.css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      padding: ", " ", ";\n    "], ["\n      padding: ", " ", ";\n    "])), size.pxToRem(size.space.XXS), size.pxToRem(size.space.XS));
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=Tooltip.js.map