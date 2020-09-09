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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrimaryButtonAnchor = exports.PrimaryButton = void 0;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var ua_1 = require("../../libs/ua");
var useTheme_1 = require("../../hooks/useTheme");
var BaseButton_1 = require("./BaseButton");
exports.PrimaryButton = function (props) {
    var theme = useTheme_1.useTheme();
    return react_1.default.createElement(PrimaryStyleButton, __assign({ themes: theme }, props));
};
// set the displayName explicit.
// This is for error message of BottomFixedArea component.
exports.PrimaryButton.displayName = 'PrimaryButton';
exports.PrimaryButtonAnchor = function (props) {
    var theme = useTheme_1.useTheme();
    return react_1.default.createElement(PrimaryStyleButtonAnchor, __assign({ themes: theme }, props));
};
// set the displayName explicit.
// This is for error message of BottomFixedArea component.
exports.PrimaryButtonAnchor.displayName = 'PrimaryButtonAnchor';
var primaryStyle = styled_components_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var palette = themes.palette, interaction = themes.interaction;
    return styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      color: #fff;\n      border: none;\n      background-color: ", ";\n      color: #fff;\n      transition: ", ";\n\n      &.hover {\n        background-color: ", ";\n      }\n\n      &[disabled] {\n        background-color: ", ";\n        color: ", ";\n      }\n    "], ["\n      color: #fff;\n      border: none;\n      background-color: ", ";\n      color: #fff;\n      transition: ", ";\n\n      &.hover {\n        background-color: ", ";\n      }\n\n      &[disabled] {\n        background-color: ", ";\n        color: ", ";\n      }\n    "])), palette.MAIN, ua_1.isTouchDevice ? 'none' : "all " + interaction.hover.animation, palette.hoverColor(palette.MAIN), palette.disableColor(palette.MAIN), palette.disableColor('#fff'));
});
var PrimaryStyleButton = styled_components_1.default(BaseButton_1.BaseButton)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  ", "\n"], ["\n  ", "\n"])), primaryStyle);
var PrimaryStyleButtonAnchor = styled_components_1.default(BaseButton_1.BaseButtonAnchor)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", "\n"], ["\n  ", "\n"])), primaryStyle);
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=PrimaryButton.js.map