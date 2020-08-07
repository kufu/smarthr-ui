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
exports.DropdownContentInner = exports.DropdownContentInnerContext = void 0;
var react_1 = __importStar(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var useTheme_1 = require("../../hooks/useTheme");
var dropdownHelper_1 = require("./dropdownHelper");
var DropdownCloser_1 = require("./DropdownCloser");
exports.DropdownContentInnerContext = react_1.createContext({
    maxHeight: '',
});
exports.DropdownContentInner = function (_a) {
    var triggerRect = _a.triggerRect, scrollable = _a.scrollable, children = _a.children, className = _a.className, controllable = _a.controllable;
    var theme = useTheme_1.useTheme();
    var _b = react_1.useState(false), isMounted = _b[0], setIsMounted = _b[1];
    var _c = react_1.useState(false), isActive = _c[0], setIsActive = _c[1];
    var _d = react_1.useState({
        top: '0',
        left: '0',
        maxHeight: '',
    }), contentBox = _d[0], setContentBox = _d[1];
    var wrapperRef = react_1.useRef(null);
    react_1.useEffect(function () {
        setIsMounted(true);
    }, []);
    react_1.useEffect(function () {
        if (isMounted && wrapperRef.current) {
            setContentBox(dropdownHelper_1.getContentBoxStyle(triggerRect, {
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
    return (react_1.default.createElement(Wrapper, { ref: wrapperRef, contentBox: contentBox, scrollable: scrollable, className: className + " " + (isActive ? 'active' : ''), controllable: controllable, themes: theme }, controllable ? (children) : (react_1.default.createElement(exports.DropdownContentInnerContext.Provider, { value: { maxHeight: contentBox.maxHeight } },
        react_1.default.createElement(DropdownCloser_1.DropdownCloser, null, children)))));
};
var Wrapper = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var contentBox = _a.contentBox, themes = _a.themes, scrollable = _a.scrollable, controllable = _a.controllable;
    return styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      visibility: hidden;\n      z-index: 99999;\n      position: absolute;\n      top: ", ";\n      left: ", ";\n      border-radius: ", ";\n      box-shadow: 0 4px 10px 0 rgba(51, 51, 51, 0.3);\n      background-color: #fff;\n      white-space: nowrap;\n\n      ", "\n\n      ", "\n\n      &.active {\n        visibility: visible;\n      }\n    "], ["\n      visibility: hidden;\n      z-index: 99999;\n      position: absolute;\n      top: ", ";\n      left: ", ";\n      border-radius: ", ";\n      box-shadow: 0 4px 10px 0 rgba(51, 51, 51, 0.3);\n      background-color: #fff;\n      white-space: nowrap;\n\n      ",
        "\n\n      ",
        "\n\n      &.active {\n        visibility: visible;\n      }\n    "])), contentBox.top, contentBox.left, themes.frame.border.radius.m, controllable
        ? "\n          display: flex;\n          flex-direction: column;\n          "
        : '', contentBox.maxHeight && scrollable && controllable
        ? "\n          max-height: " + contentBox.maxHeight + ";\n          "
        : '');
});
var templateObject_1, templateObject_2;
//# sourceMappingURL=DropdownContentInner.js.map