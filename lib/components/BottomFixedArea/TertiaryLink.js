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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TertiaryLink = void 0;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var Icon_1 = require("../Icon");
var useTheme_1 = require("../../hooks/useTheme");
exports.TertiaryLink = function (_a) {
    var text = _a.text, iconName = _a.iconName, onClick = _a.onClick;
    var theme = useTheme_1.useTheme();
    return (react_1.default.createElement(Button, { onClick: onClick, themes: theme },
        iconName && react_1.default.createElement(Icon_1.Icon, { size: 14, name: iconName }),
        react_1.default.createElement(Text, { themes: theme }, text)));
};
var resetButtonStyle = styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background-color: transparent;\n  border: none;\n  padding: 0;\n  appearance: none;\n"], ["\n  background-color: transparent;\n  border: none;\n  padding: 0;\n  appearance: none;\n"])));
var Button = styled_components_1.default.button(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  ", "\n  ", "\n"], ["\n  ", "\n  ",
    "\n"])), resetButtonStyle, function (_a) {
    var themes = _a.themes;
    var pxToRem = themes.size.pxToRem;
    return styled_components_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      color: #007bc2;\n      display: flex;\n      align-items: center;\n\n      &:hover {\n        text-decoration: underline;\n        cursor: pointer;\n      }\n\n      > svg {\n        margin-right: ", ";\n      }\n    "], ["\n      color: #007bc2;\n      display: flex;\n      align-items: center;\n\n      &:hover {\n        text-decoration: underline;\n        cursor: pointer;\n      }\n\n      > svg {\n        margin-right: ", ";\n      }\n    "])), pxToRem(4));
});
var Text = styled_components_1.default.p(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, font = _b.font;
    return styled_components_1.css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      margin: 0px;\n      font-size: ", ";\n    "], ["\n      margin: 0px;\n      font-size: ", ";\n    "])), pxToRem(font.GRANDE));
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=TertiaryLink.js.map