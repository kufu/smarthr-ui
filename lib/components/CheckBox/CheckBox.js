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
exports.CheckBox = void 0;
var react_1 = __importStar(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var polished_1 = require("polished");
var useTheme_1 = require("../../hooks/useTheme");
var Icon_1 = require("../Icon");
exports.CheckBox = function (_a) {
    var _b = _a.mixed, mixed = _b === void 0 ? false : _b, _c = _a.className, className = _c === void 0 ? '' : _c, onChange = _a.onChange, props = __rest(_a, ["mixed", "className", "onChange"]);
    var theme = useTheme_1.useTheme();
    var checked = props.checked, disabled = props.disabled;
    var boxClassName = (checked ? 'active' : '') + " " + (disabled ? 'disabled' : '');
    var handleChange = react_1.useCallback(function (e) {
        if (onChange)
            onChange(e);
    }, [onChange]);
    return (react_1.default.createElement(Wrapper, { className: className, themes: theme },
        react_1.default.createElement(Input, __assign({}, props, { type: "checkbox", onChange: handleChange, themes: theme })),
        react_1.default.createElement(Box, { className: boxClassName, themes: theme }),
        checked && (react_1.default.createElement(IconWrap, { themes: theme },
            react_1.default.createElement(Icon_1.Icon, { name: mixed ? 'fa-minus' : 'fa-check', size: 10, color: "#fff" })))));
};
var Wrapper = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size;
    return styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      position: relative;\n      display: inline-block;\n      width: ", ";\n      height: ", ";\n      flex-shrink: 0;\n      line-height: 1;\n      box-sizing: border-box;\n    "], ["\n      position: relative;\n      display: inline-block;\n      width: ", ";\n      height: ", ";\n      flex-shrink: 0;\n      line-height: 1;\n      box-sizing: border-box;\n    "])), size.pxToRem(16), size.pxToRem(16));
});
var Box = styled_components_1.default.span(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var frame = themes.frame, palette = themes.palette;
    return styled_components_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      position: absolute;\n      width: 100%;\n      height: 100%;\n      border-radius: 4px;\n      border: ", ";\n      background-color: #fff;\n      box-sizing: border-box;\n      pointer-events: none;\n      &.active {\n        border-color: ", ";\n        background-color: ", ";\n      }\n      &.disabled {\n        background-color: ", ";\n        border-color: ", ";\n        &.active {\n          border-color: ", ";\n        }\n      }\n    "], ["\n      position: absolute;\n      width: 100%;\n      height: 100%;\n      border-radius: 4px;\n      border: ", ";\n      background-color: #fff;\n      box-sizing: border-box;\n      pointer-events: none;\n      &.active {\n        border-color: ", ";\n        background-color: ", ";\n      }\n      &.disabled {\n        background-color: ", ";\n        border-color: ", ";\n        &.active {\n          border-color: ", ";\n        }\n      }\n    "])), frame.border.default, palette.MAIN, palette.MAIN, palette.BORDER, palette.BORDER, palette.BORDER);
});
var Input = styled_components_1.default.input(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.palette, MAIN = _b.MAIN, OUTLINE = _b.OUTLINE;
    return styled_components_1.css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n      opacity: 0;\n      position: absolute;\n      top: 0;\n      left: 0;\n      width: 100%;\n      height: 100%;\n      margin: 0;\n      cursor: pointer;\n      &[disabled] {\n        pointer-events: none;\n      }\n      &:hover + span {\n        box-shadow: 0 0 0 2px ", ";\n      }\n      &:focus + span {\n        box-shadow: 0 0 0 2px ", ";\n      }\n    "], ["\n      opacity: 0;\n      position: absolute;\n      top: 0;\n      left: 0;\n      width: 100%;\n      height: 100%;\n      margin: 0;\n      cursor: pointer;\n      &[disabled] {\n        pointer-events: none;\n      }\n      &:hover + span {\n        box-shadow: 0 0 0 2px ", ";\n      }\n      &:focus + span {\n        box-shadow: 0 0 0 2px ", ";\n      }\n    "])), polished_1.transparentize(0.78, MAIN), OUTLINE);
});
var IconWrap = styled_components_1.default.span(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size;
    return styled_components_1.css(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n      position: absolute;\n      top: 50%;\n      left: 50%;\n      display: inline-block;\n      width: ", ";\n      height: ", ";\n      transform: translate(-50%, -50%);\n      pointer-events: none;\n      & > svg {\n        vertical-align: top;\n      }\n    "], ["\n      position: absolute;\n      top: 50%;\n      left: 50%;\n      display: inline-block;\n      width: ", ";\n      height: ", ";\n      transform: translate(-50%, -50%);\n      pointer-events: none;\n      & > svg {\n        vertical-align: top;\n      }\n    "])), size.pxToRem(10), size.pxToRem(10));
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
//# sourceMappingURL=CheckBox.js.map