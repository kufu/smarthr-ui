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
exports.DefinitionListItem = void 0;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var useTheme_1 = require("../../hooks/useTheme");
var Heading_1 = require("../Heading");
exports.DefinitionListItem = function (_a) {
    var term = _a.term, description = _a.description, _b = _a.termTag, termTag = _b === void 0 ? 'span' : _b, _c = _a.className, className = _c === void 0 ? '' : _c;
    var theme = useTheme_1.useTheme();
    return (react_1.default.createElement(Wrapper, { className: className, themes: theme },
        react_1.default.createElement("dt", null,
            react_1.default.createElement(Heading_1.Heading, { tag: termTag, type: "subSubBlockTitle" }, term)),
        react_1.default.createElement(Content, { themes: theme }, description)));
};
var Wrapper = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var palette = themes.palette, size = themes.size;
    return styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      padding-bottom: ", ";\n      border-bottom: 1px dotted ", ";\n    "], ["\n      padding-bottom: ", ";\n      border-bottom: 1px dotted ", ";\n    "])), size.pxToRem(5), palette.BORDER);
});
var Content = styled_components_1.default.dd(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size, palette = themes.palette;
    return styled_components_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      margin: ", " 0 0;\n      padding: 0;\n      color: ", ";\n      font-size: ", ";\n      line-height: 1.5;\n    "], ["\n      margin: ", " 0 0;\n      padding: 0;\n      color: ", ";\n      font-size: ", ";\n      line-height: 1.5;\n    "])), size.pxToRem(5), palette.TEXT_BLACK, size.pxToRem(size.font.TALL));
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=DefinitionListItem.js.map