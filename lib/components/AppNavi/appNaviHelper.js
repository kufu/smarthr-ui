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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItemStyle = exports.getIconComponent = void 0;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var Icon_1 = require("../Icon");
exports.getIconComponent = function (theme, options) {
    var opts = __assign({ icon: null, current: false }, options);
    var _a = theme.palette, TEXT_BLACK = _a.TEXT_BLACK, TEXT_GREY = _a.TEXT_GREY;
    if (!opts.icon)
        return null;
    return (react_1.default.createElement(IconWrapper, { themes: theme },
        react_1.default.createElement(Icon_1.Icon, { name: opts.icon, size: 14, color: opts.current ? TEXT_BLACK : TEXT_GREY })));
};
var IconWrapper = styled_components_1.default.figure(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space;
    return styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      display: flex;\n      padding: 0;\n      margin: 0 ", " 0 0;\n    "], ["\n      display: flex;\n      padding: 0;\n      margin: 0 ", " 0 0;\n    "])), pxToRem(space.XXS));
});
function getItemStyle(_a) {
    var themes = _a.themes, isActive = _a.isActive, isUnclickable = _a.isUnclickable;
    var _b = themes.size, pxToRem = _b.pxToRem, font = _b.font;
    var _c = themes.palette, hoverColor = _c.hoverColor, MAIN = _c.MAIN, TEXT_BLACK = _c.TEXT_BLACK, TEXT_GREY = _c.TEXT_GREY;
    return styled_components_1.css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n    display: flex;\n    align-items: center;\n    box-sizing: border-box;\n    height: 40px;\n    padding: 0 0.4rem;\n    margin: 0;\n    background: none;\n    border: none;\n    color: ", ";\n    font-size: ", ";\n    font-weight: bold;\n    text-decoration: none;\n    transition: background-color 0.3s;\n    ", "\n    ", "\n  "], ["\n    display: flex;\n    align-items: center;\n    box-sizing: border-box;\n    height: 40px;\n    padding: 0 0.4rem;\n    margin: 0;\n    background: none;\n    border: none;\n    color: ", ";\n    font-size: ", ";\n    font-weight: bold;\n    text-decoration: none;\n    transition: background-color 0.3s;\n    ",
        "\n    ",
        "\n  "])), TEXT_GREY, pxToRem(font.TALL), isActive && styled_components_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      color: ", ";\n      position: relative;\n      &::after {\n        content: '';\n        display: block;\n        height: ", ";\n        background-color: ", ";\n        position: absolute;\n        left: 0;\n        right: 0;\n        bottom: 0;\n      }\n    "], ["\n      color: ", ";\n      position: relative;\n      &::after {\n        content: '';\n        display: block;\n        height: ", ";\n        background-color: ", ";\n        position: absolute;\n        left: 0;\n        right: 0;\n        bottom: 0;\n      }\n    "])), TEXT_BLACK, pxToRem(3), MAIN), !isUnclickable && styled_components_1.css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      cursor: pointer;\n      &:hover {\n        background-color: ", ";\n      }\n    "], ["\n      cursor: pointer;\n      &:hover {\n        background-color: ", ";\n      }\n    "])), hoverColor('#fff')));
}
exports.getItemStyle = getItemStyle;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=appNaviHelper.js.map