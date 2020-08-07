"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogContentInner = void 0;
var react_1 = __importStar(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var react_transition_group_1 = require("react-transition-group");
var useTheme_1 = require("../../hooks/useTheme");
var useHandleEscape_1 = require("../../hooks/useHandleEscape");
var DialogPositionProvider_1 = require("./DialogPositionProvider");
function exist(value) {
    return value !== undefined && value !== null;
}
exports.DialogContentInner = function (_a) {
    var onClickOverlay = _a.onClickOverlay, _b = _a.onPressEscape, onPressEscape = _b === void 0 ? function () {
        /* noop */
    } : _b, isOpen = _a.isOpen, children = _a.children, props = __rest(_a, ["onClickOverlay", "onPressEscape", "isOpen", "children"]);
    var theme = useTheme_1.useTheme();
    var domRef = react_1.useRef(null);
    useHandleEscape_1.useHandleEscape(onPressEscape);
    return (react_1.default.createElement(DialogPositionProvider_1.DialogPositionProvider, { top: props.top, bottom: props.bottom },
        react_1.default.createElement(react_transition_group_1.CSSTransition, { nodeRef: domRef, className: "wrapper", classNames: "wrapper", in: isOpen, timeout: {
                appear: 500,
                enter: 300,
                exit: 300,
            }, appear: true, unmountOnExit: true },
            react_1.default.createElement(Wrapper, { ref: domRef },
                react_1.default.createElement(Background, { onClick: onClickOverlay, themes: theme }),
                react_1.default.createElement(Inner, __assign({ themes: theme }, props), children),
                react_1.default.createElement(ScrollSuppressing, null)))));
};
var Wrapper = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  z-index: 10000;\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  &.wrapper-appear {\n    opacity: 0;\n  }\n  &.wrapper-appear-active {\n    transition: opacity 500ms;\n    opacity: 1;\n  }\n  &.wrapper-enter {\n    opacity: 0;\n  }\n  &.wrapper-enter-active {\n    transition: opacity 300ms;\n    opacity: 1;\n  }\n  &.wrapper-exit {\n    opacity: 1;\n  }\n  &.wrapper-exit-active {\n    transition: opacity 300ms;\n    opacity: 0;\n  }\n"], ["\n  z-index: 10000;\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  &.wrapper-appear {\n    opacity: 0;\n  }\n  &.wrapper-appear-active {\n    transition: opacity 500ms;\n    opacity: 1;\n  }\n  &.wrapper-enter {\n    opacity: 0;\n  }\n  &.wrapper-enter-active {\n    transition: opacity 300ms;\n    opacity: 1;\n  }\n  &.wrapper-exit {\n    opacity: 1;\n  }\n  &.wrapper-exit-active {\n    transition: opacity 300ms;\n    opacity: 0;\n  }\n"])));
var Inner = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
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
    return styled_components_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      position: absolute;\n      z-index: 10100;\n      top: ", ";\n      right: ", ";\n      bottom: ", ";\n      left: ", ";\n      border-radius: ", ";\n      background-color: #fff;\n      box-shadow: 0 4px 10px 0 rgba(51, 51, 51, 0.3);\n      transform: translate(", ", ", ");\n    "], ["\n      position: absolute;\n      z-index: 10100;\n      top: ", ";\n      right: ", ";\n      bottom: ", ";\n      left: ", ";\n      border-radius: ", ";\n      background-color: #fff;\n      box-shadow: 0 4px 10px 0 rgba(51, 51, 51, 0.3);\n      transform: translate(", ", ", ");\n    "])), positionTop, positionRight, positionBottom, positionLeft, themes.frame.border.radius.l, translateX, translateY);
});
var Background = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    return styled_components_1.css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      position: fixed;\n      top: 0;\n      left: 0;\n      width: 100%;\n      height: 100%;\n      background-color: ", ";\n    "], ["\n      position: fixed;\n      top: 0;\n      left: 0;\n      width: 100%;\n      height: 100%;\n      background-color: ", ";\n    "])), themes.palette.SCRIM);
});
var ScrollSuppressing = styled_components_1.createGlobalStyle(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  body {\n    overflow: hidden;\n  }\n"], ["\n  body {\n    overflow: hidden;\n  }\n"])));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=DialogContentInner.js.map