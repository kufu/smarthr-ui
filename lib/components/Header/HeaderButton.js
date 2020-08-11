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
exports.HeaderButton = void 0;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var Icon_1 = require("../Icon/Icon");
var useTheme_1 = require("../../hooks/useTheme");
exports.HeaderButton = function (_a) {
    var icon = _a.icon, children = _a.children, onClick = _a.onClick;
    var theme = useTheme_1.useTheme();
    return (react_1.default.createElement(Wrapper, { themes: theme, onClick: onClick },
        icon && (react_1.default.createElement(IconWrapper, { themes: theme, role: "presentation" },
            react_1.default.createElement(Icon_1.Icon, { name: icon }))),
        children));
};
var Wrapper = styled_components_1.default.button(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size, interaction = themes.interaction;
    return styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      display: inline-block;\n      margin: 0;\n      padding: 0 ", ";\n      border: none;\n      background: none;\n      color: #fff;\n      font-size: ", ";\n      line-height: 50px;\n      transition: background-color ", ";\n      cursor: pointer;\n\n      &:hover {\n        background-color: rgba(255, 255, 255, 0.3);\n      }\n    "], ["\n      display: inline-block;\n      margin: 0;\n      padding: 0 ", ";\n      border: none;\n      background: none;\n      color: #fff;\n      font-size: ", ";\n      line-height: 50px;\n      transition: background-color ", ";\n      cursor: pointer;\n\n      &:hover {\n        background-color: rgba(255, 255, 255, 0.3);\n      }\n    "])), size.pxToRem(10), size.pxToRem(size.font.TALL), interaction.hover.animation);
});
var IconWrapper = styled_components_1.default.figure(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size;
    return styled_components_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      display: inline-block;\n      padding: 0;\n      margin: 0 ", " 0 0;\n      vertical-align: middle;\n    "], ["\n      display: inline-block;\n      padding: 0;\n      margin: 0 ", " 0 0;\n      vertical-align: middle;\n    "])), size.pxToRem(size.space.XXS));
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=HeaderButton.js.map