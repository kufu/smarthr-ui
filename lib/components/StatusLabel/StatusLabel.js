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
exports.StatusLabel = void 0;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var useTheme_1 = require("../../hooks/useTheme");
exports.StatusLabel = function (_a) {
    var _b = _a.type, type = _b === void 0 ? 'done' : _b, _c = _a.className, className = _c === void 0 ? '' : _c, children = _a.children;
    var theme = useTheme_1.useTheme();
    return (react_1.default.createElement(Wrapper, { className: type + " " + className, themes: theme }, children));
};
var borderStyle = function (border) { return styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  border: ", ";\n  background-color: #fff;\n"], ["\n  border: ", ";\n  background-color: #fff;\n"])), border); };
var fillStyle = function (backgroundColor) { return styled_components_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  background-color: ", ";\n  color: #fff;\n"], ["\n  background-color: ", ";\n  color: #fff;\n"])), backgroundColor); };
var Wrapper = styled_components_1.default.span(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size, frame = themes.frame, palette = themes.palette;
    return styled_components_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      height: ", ";\n      box-sizing: border-box;\n      margin: 0;\n      padding: 0 ", ";\n      display: inline-block;\n      white-space: nowrap;\n      font-size: ", ";\n      font-weight: bold;\n      line-height: calc(", " - ", " * 2);\n\n      &.done {\n        ", "\n        border-color: ", ";\n        color: ", ";\n      }\n\n      &.success {\n        ", "\n        border-color: ", ";\n        color: ", ";\n      }\n\n      &.process {\n        ", "\n        border-color: ", ";\n        color: ", ";\n      }\n\n      &.required {\n        ", "\n        border-color: ", ";\n        color: ", ";\n      }\n\n      &.disabled {\n        ", "\n        background-color: ", ";\n      }\n\n      &.must {\n        ", "\n        background-color: ", ";\n      }\n\n      &.warning {\n        ", "\n        background-color: ", ";\n      }\n\n      &.error {\n        ", "\n        background-color: ", ";\n      }\n    "], ["\n      height: ", ";\n      box-sizing: border-box;\n      margin: 0;\n      padding: 0 ", ";\n      display: inline-block;\n      white-space: nowrap;\n      font-size: ", ";\n      font-weight: bold;\n      line-height: calc(", " - ", " * 2);\n\n      &.done {\n        ", "\n        border-color: ", ";\n        color: ", ";\n      }\n\n      &.success {\n        ", "\n        border-color: ", ";\n        color: ", ";\n      }\n\n      &.process {\n        ", "\n        border-color: ", ";\n        color: ", ";\n      }\n\n      &.required {\n        ", "\n        border-color: ", ";\n        color: ", ";\n      }\n\n      &.disabled {\n        ", "\n        background-color: ", ";\n      }\n\n      &.must {\n        ", "\n        background-color: ", ";\n      }\n\n      &.warning {\n        ", "\n        background-color: ", ";\n      }\n\n      &.error {\n        ", "\n        background-color: ", ";\n      }\n    "])), size.pxToRem(20), size.pxToRem(size.space.XXS), size.pxToRem(size.font.SHORT), size.pxToRem(20), frame.border.lineWidth, borderStyle(frame.border.default), palette.BORDER, palette.TEXT_GREY, borderStyle(frame.border.default), palette.MAIN, palette.MAIN, borderStyle(frame.border.default), palette.WARNING, palette.WARNING, borderStyle(frame.border.default), palette.DANGER, palette.DANGER, fillStyle(palette.BORDER), palette.TEXT_GREY, fillStyle(palette.BORDER), palette.MAIN, fillStyle(palette.BORDER), palette.WARNING, fillStyle(palette.BORDER), palette.DANGER);
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=StatusLabel.js.map