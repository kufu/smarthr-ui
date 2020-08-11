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
exports.FieldSet = void 0;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var useTheme_1 = require("../../hooks/useTheme");
var Input_1 = require("../Input");
var Heading_1 = require("../Heading");
var StatusLabel_1 = require("../StatusLabel");
var Icon_1 = require("../Icon");
exports.FieldSet = function (_a) {
    var label = _a.label, _b = _a.labelType, labelType = _b === void 0 ? 'subBlockTitle' : _b, _c = _a.labelTagType, labelTagType = _c === void 0 ? 'span' : _c, errorMessage = _a.errorMessage, helpMessage = _a.helpMessage, _d = _a.className, className = _d === void 0 ? '' : _d, labelSuffix = _a.labelSuffix, children = _a.children, props = __rest(_a, ["label", "labelType", "labelTagType", "errorMessage", "helpMessage", "className", "labelSuffix", "children"]);
    var theme = useTheme_1.useTheme();
    return (react_1.default.createElement(Wrapper, { width: props.width || 'auto', className: className },
        react_1.default.createElement(Title, { themes: theme },
            react_1.default.createElement(TitleText, { type: labelType, tag: labelTagType }, label),
            props.required && react_1.default.createElement(StatusLabel_1.StatusLabel, { type: "required" }, "\u5FC5\u9808"),
            labelSuffix && labelSuffix),
        children ? children : react_1.default.createElement(Input_1.Input, __assign({}, props, { error: !!errorMessage })),
        errorMessage &&
            (typeof errorMessage === 'string' ? [errorMessage] : errorMessage).map(function (message) { return (react_1.default.createElement(Error, { themes: theme, key: message },
                react_1.default.createElement(ErrorIcon, { name: "fa-exclamation-circle", color: theme.palette.DANGER }),
                react_1.default.createElement(ErrorText, null, message))); }),
        helpMessage && react_1.default.createElement(Help, { themes: theme }, helpMessage)));
};
var Wrapper = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var width = _a.width;
    return styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    display: inline-block;\n    width: ", ";\n  "], ["\n    display: inline-block;\n    width: ", ";\n  "])), typeof width === 'number' ? width + "px" : width);
});
var Title = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    return styled_components_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    display: flex;\n    align-items: center;\n    margin: 0 0 ", ";\n\n    > *:not(:first-child) {\n      margin-left: ", ";\n    }\n  "], ["\n    display: flex;\n    align-items: center;\n    margin: 0 0 ", ";\n\n    > *:not(:first-child) {\n      margin-left: ", ";\n    }\n  "])), themes.size.pxToRem(themes.size.space.XXS), themes.size.pxToRem(themes.size.space.XXS));
});
var TitleText = styled_components_1.default(Heading_1.Heading)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: inline-block;\n"], ["\n  display: inline-block;\n"])));
var Help = styled_components_1.default.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    return styled_components_1.css(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n    margin: ", " 0 0 0;\n    font-size: ", ";\n    line-height: 1;\n    color: ", ";\n  "], ["\n    margin: ", " 0 0 0;\n    font-size: ", ";\n    line-height: 1;\n    color: ", ";\n  "])), themes.size.pxToRem(themes.size.space.XXS), themes.size.pxToRem(themes.size.font.SHORT), themes.palette.TEXT_GREY);
});
var Error = styled_components_1.default.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    return styled_components_1.css(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n    margin: ", " 0 0 0;\n    font-size: ", ";\n    line-height: 1;\n  "], ["\n    margin: ", " 0 0 0;\n    font-size: ", ";\n    line-height: 1;\n  "])), themes.size.pxToRem(themes.size.space.XXS), themes.size.pxToRem(themes.size.font.SHORT));
});
var ErrorIcon = styled_components_1.default(Icon_1.Icon)(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  margin-right: 0.4rem;\n  vertical-align: middle;\n"], ["\n  margin-right: 0.4rem;\n  vertical-align: middle;\n"])));
var ErrorText = styled_components_1.default.span(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n  vertical-align: middle;\n"], ["\n  vertical-align: middle;\n"])));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11;
//# sourceMappingURL=FieldSet.js.map