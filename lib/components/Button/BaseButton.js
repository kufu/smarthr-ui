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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseButtonAnchor = exports.BaseButton = exports.buttonFactory = void 0;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var useTheme_1 = require("../../hooks/useTheme");
var hoverable_1 = require("../../hocs/hoverable");
var ua_1 = require("../../libs/ua");
exports.buttonFactory = function (tag) { return function (_a) {
    var _b = _a.size, size = _b === void 0 ? 'default' : _b, _c = _a.className, className = _c === void 0 ? '' : _c, _d = _a.square, square = _d === void 0 ? false : _d, _e = _a.children, children = _e === void 0 ? '' : _e, _f = _a.prefix, prefix = _f === void 0 ? '' : _f, _g = _a.suffix, suffix = _g === void 0 ? '' : _g, props = __rest(_a, ["size", "className", "square", "children", "prefix", "suffix"]);
    var theme = useTheme_1.useTheme();
    var Tag = hoverable_1.hoverable()(tagStore[tag]);
    // prettier-ignore
    var classNames = size + " " + className + " " + (square ? 'square' : '') + " " + (prefix ? 'prefix' : '') + " " + (suffix ? 'suffix' : '');
    return (react_1.default.createElement(Tag, __assign({ className: classNames, themes: theme }, props),
        prefix && react_1.default.createElement(Prefix, { themes: theme }, prefix),
        children,
        suffix && react_1.default.createElement(Suffix, { themes: theme }, suffix)));
}; };
var Base = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes, wide = _a.wide;
    var frame = themes.frame, size = themes.size, interaction = themes.interaction;
    return styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      display: inline-flex;\n      justify-content: center;\n      align-items: center;\n      width: ", ";\n      min-width: 2rem;\n      vertical-align: middle;\n      border-radius: ", ";\n      font-family: inherit;\n      font-weight: bold;\n      text-align: center;\n      text-decoration: none;\n      box-sizing: border-box;\n      cursor: pointer;\n      transition: ", ";\n      white-space: nowrap;\n\n      &.default {\n        font-size: ", ";\n        height: 40px;\n        padding: 0 ", ";\n      }\n\n      &.s {\n        font-size: ", ";\n        height: 27px;\n        padding: 0 ", ";\n      }\n\n      &.square {\n        width: 40px;\n        padding: 0;\n\n        &.s {\n          width: 27px;\n          min-width: 27px;\n        }\n      }\n\n      &[disabled] {\n        cursor: not-allowed;\n      }\n\n      &.suffix {\n        justify-content: space-between;\n      }\n\n      &.prefix {\n        justify-content: left;\n      }\n    "], ["\n      display: inline-flex;\n      justify-content: center;\n      align-items: center;\n      width: ", ";\n      min-width: 2rem;\n      vertical-align: middle;\n      border-radius: ", ";\n      font-family: inherit;\n      font-weight: bold;\n      text-align: center;\n      text-decoration: none;\n      box-sizing: border-box;\n      cursor: pointer;\n      transition: ", ";\n      white-space: nowrap;\n\n      &.default {\n        font-size: ", ";\n        height: 40px;\n        padding: 0 ", ";\n      }\n\n      &.s {\n        font-size: ", ";\n        height: 27px;\n        padding: 0 ", ";\n      }\n\n      &.square {\n        width: 40px;\n        padding: 0;\n\n        &.s {\n          width: 27px;\n          min-width: 27px;\n        }\n      }\n\n      &[disabled] {\n        cursor: not-allowed;\n      }\n\n      &.suffix {\n        justify-content: space-between;\n      }\n\n      &.prefix {\n        justify-content: left;\n      }\n    "])), wide ? '100%;' : 'auto', frame.border.radius.m, ua_1.isTouchDevice ? 'none' : "all " + interaction.hover.animation, size.pxToRem(size.font.TALL), size.pxToRem(size.space.XS), size.pxToRem(size.font.SHORT), size.pxToRem(size.space.XXS));
});
var Prefix = styled_components_1.default.span(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space;
    return styled_components_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      display: inline-flex;\n      margin-right: ", ";\n    "], ["\n      display: inline-flex;\n      margin-right: ", ";\n    "])), pxToRem(space.XXS));
});
var Suffix = styled_components_1.default.span(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space;
    return styled_components_1.css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n      display: inline-flex;\n      margin-left: ", ";\n    "], ["\n      display: inline-flex;\n      margin-left: ", ";\n    "])), pxToRem(space.XXS));
});
var tagStore = {
    button: Base.withComponent('button'),
    a: Base.withComponent('a'),
};
exports.BaseButton = exports.buttonFactory('button');
exports.BaseButtonAnchor = exports.buttonFactory('a');
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=BaseButton.js.map