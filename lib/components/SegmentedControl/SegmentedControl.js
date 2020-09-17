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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SegmentedControl = void 0;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var useTheme_1 = require("../../hooks/useTheme");
var Button_1 = require("../Button");
exports.SegmentedControl = function (_a) {
    var options = _a.options, value = _a.value, onClickOption = _a.onClickOption, _b = _a.size, size = _b === void 0 ? 'default' : _b, _c = _a.isSquare, isSquare = _c === void 0 ? false : _c, className = _a.className;
    var themes = useTheme_1.useTheme();
    return (react_1.default.createElement(Container, { className: className }, options.map(function (option) {
        var isSelected = !!value && value === option.value;
        var Button = isSelected ? SelectedButton : DefaultButton;
        var onClick = onClickOption ? function () { return onClickOption(option.value); } : undefined;
        return (react_1.default.createElement(Button, { "aria-label": option.ariaLabel, key: option.value, disabled: option.disabled, onClick: onClick, size: size, square: isSquare, themes: themes }, option.content));
    })));
};
var Container = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: inline-flex;\n"], ["\n  display: inline-flex;\n"])));
var buttonStyle = styled_components_1.css(function (_a) {
    var themes = _a.themes;
    var border = themes.frame.border;
    return styled_components_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    border: ", ";\n    border-radius: 0;\n\n    &:first-child {\n      border-top-left-radius: ", ";\n      border-bottom-left-radius: ", ";\n    }\n    &:last-child {\n      border-top-right-radius: ", ";\n      border-bottom-right-radius: ", ";\n    }\n    :not(:last-child) {\n      border-right-width: 0;\n    }\n  "], ["\n    border: ", ";\n    border-radius: 0;\n\n    &:first-child {\n      border-top-left-radius: ", ";\n      border-bottom-left-radius: ", ";\n    }\n    &:last-child {\n      border-top-right-radius: ", ";\n      border-bottom-right-radius: ", ";\n    }\n    :not(:last-child) {\n      border-right-width: 0;\n    }\n  "])), border.default, border.radius.m, border.radius.m, border.radius.m, border.radius.m);
});
var DefaultButton = styled_components_1.default(Button_1.SecondaryButton)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  ", "\n"], ["\n  ", "\n"])), buttonStyle);
var SelectedButton = styled_components_1.default(Button_1.PrimaryButton)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", "\n"], ["\n  ", "\n"])), buttonStyle);
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=SegmentedControl.js.map