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
exports.Heading = void 0;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var useTheme_1 = require("../../hooks/useTheme");
exports.Heading = function (_a) {
    var _b = _a.tag, tag = _b === void 0 ? 'h1' : _b, _c = _a.type, type = _c === void 0 ? 'screenTitle' : _c, _d = _a.className, className = _d === void 0 ? '' : _d, children = _a.children, disabled = _a.disabled;
    var theme = useTheme_1.useTheme();
    return (react_1.default.createElement(Wrapper, { as: tag, className: type + " " + (disabled && 'disabled') + " " + className, themes: theme }, children));
};
var Wrapper = styled_components_1.default.h1(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var palette = themes.palette, size = themes.size;
    return styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      display: block;\n      margin: 0;\n      padding: 0;\n      line-height: 1;\n\n      &.screenTitle {\n        color: ", ";\n        font-size: ", ";\n        font-weight: normal;\n      }\n\n      &.sectionTitle {\n        color: ", ";\n        font-size: ", ";\n        font-weight: normal;\n      }\n\n      &.blockTitle {\n        color: ", ";\n        font-size: ", ";\n        font-weight: bold;\n      }\n\n      &.subBlockTitle {\n        color: ", ";\n        font-size: ", ";\n        font-weight: bold;\n      }\n\n      &.subSubBlockTitle {\n        color: ", ";\n        font-size: ", ";\n        font-weight: bold;\n      }\n\n      &.disabled {\n        color: ", ";\n      }\n    "], ["\n      display: block;\n      margin: 0;\n      padding: 0;\n      line-height: 1;\n\n      &.screenTitle {\n        color: ", ";\n        font-size: ", ";\n        font-weight: normal;\n      }\n\n      &.sectionTitle {\n        color: ", ";\n        font-size: ", ";\n        font-weight: normal;\n      }\n\n      &.blockTitle {\n        color: ", ";\n        font-size: ", ";\n        font-weight: bold;\n      }\n\n      &.subBlockTitle {\n        color: ", ";\n        font-size: ", ";\n        font-weight: bold;\n      }\n\n      &.subSubBlockTitle {\n        color: ", ";\n        font-size: ", ";\n        font-weight: bold;\n      }\n\n      &.disabled {\n        color: ", ";\n      }\n    "])), palette.TEXT_BLACK, size.pxToRem(size.font.VENTI), palette.TEXT_BLACK, size.pxToRem(size.font.GRANDE), palette.TEXT_BLACK, size.pxToRem(size.font.TALL), palette.TEXT_GREY, size.pxToRem(size.font.TALL), palette.TEXT_GREY, size.pxToRem(size.font.SHORT), palette.TEXT_DISABLED);
});
var templateObject_1, templateObject_2;
//# sourceMappingURL=Heading.js.map