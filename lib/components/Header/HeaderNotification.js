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
exports.HeaderNotification = void 0;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var useTheme_1 = require("../../hooks/useTheme");
exports.HeaderNotification = function (_a) {
    var length = _a.length, onClick = _a.onClick;
    var theme = useTheme_1.useTheme();
    return (react_1.default.createElement(Wrapper, { themes: theme },
        react_1.default.createElement(Button, { isZero: length === 0, onClick: onClick, "aria-label": "\u901A\u77E5\u5C65\u6B74", themes: theme }, length >= 10 ? '9+' : length)));
};
var Wrapper = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var pxToRem = themes.size.pxToRem;
    return styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      display: flex;\n      align-items: center;\n      padding: 0 ", ";\n    "], ["\n      display: flex;\n      align-items: center;\n      padding: 0 ", ";\n    "])), pxToRem(10));
});
var Button = styled_components_1.default.button(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes, isZero = _a.isZero;
    var size = themes.size, interaction = themes.interaction;
    return styled_components_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      display: inline-block;\n      width: 29px;\n      height: 29px;\n      padding: 0;\n      border: none;\n      border-radius: 4px;\n      background-color: ", ";\n      color: #fff;\n      font-size: ", ";\n      transition: background-color ", ";\n      cursor: pointer;\n\n      &:hover {\n        background-color: ", ";\n      }\n    "], ["\n      display: inline-block;\n      width: 29px;\n      height: 29px;\n      padding: 0;\n      border: none;\n      border-radius: 4px;\n      background-color: ", ";\n      color: #fff;\n      font-size: ", ";\n      transition: background-color ", ";\n      cursor: pointer;\n\n      &:hover {\n        background-color: ", ";\n      }\n    "])), isZero ? '#aaa' : '#fcb156', size.pxToRem(size.font.TALL), interaction.hover.animation, isZero ? '#aaa' : '#ffc77b');
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=HeaderNotification.js.map