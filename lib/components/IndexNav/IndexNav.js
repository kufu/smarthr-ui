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
exports.IndexNav = void 0;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var useTheme_1 = require("../../hooks/useTheme");
exports.IndexNav = function (_a) {
    var items = _a.items;
    var themes = useTheme_1.useTheme();
    if (items.length === 0) {
        return null;
    }
    return (react_1.default.createElement(List, { themes: themes }, items.map(function (item, i) { return (react_1.default.createElement(Item, { key: i, themes: themes },
        react_1.default.createElement(Anchor, { href: item.href, current: item.current, "aria-current": item.current ? 'page' : undefined, themes: themes }, item.label),
        item.children && react_1.default.createElement(exports.IndexNav, { items: item.children }))); })));
};
var List = styled_components_1.default.ul(function (_a) {
    var themes = _a.themes;
    var size = themes.size;
    return styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    list-style: none;\n    margin: 0;\n    padding: 0;\n    font-size: ", ";\n  "], ["\n    list-style: none;\n    margin: 0;\n    padding: 0;\n    font-size: ", ";\n  "])), size.pxToRem(size.font.TALL));
});
var Item = styled_components_1.default.li(function (_a) {
    var themes = _a.themes;
    var size = themes.size;
    return styled_components_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    line-height: 1em;\n    &:not(:first-child) {\n      margin-top: ", ";\n    }\n    & > ", " {\n      margin-top: ", ";\n      margin-left: ", ";\n      font-size: ", ";\n    }\n  "], ["\n    line-height: 1em;\n    &:not(:first-child) {\n      margin-top: ", ";\n    }\n    & > ", " {\n      margin-top: ", ";\n      margin-left: ", ";\n      font-size: ", ";\n    }\n  "])), size.pxToRem(size.space.XS), List, size.pxToRem(size.space.XS), size.pxToRem(size.space.S), size.pxToRem(size.font.SHORT));
});
var Anchor = styled_components_1.default.a(function (_a) {
    var themes = _a.themes, current = _a.current;
    var palette = themes.palette, size = themes.size;
    return styled_components_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    padding-left: ", ";\n    border-left: 2px solid;\n    border-color: ", ";\n    line-height: 1em;\n    color: ", ";\n    font-weight: ", ";\n    text-decoration: none;\n    :hover {\n      text-decoration: underline;\n    }\n  "], ["\n    padding-left: ", ";\n    border-left: 2px solid;\n    border-color: ", ";\n    line-height: 1em;\n    color: ", ";\n    font-weight: ", ";\n    text-decoration: none;\n    :hover {\n      text-decoration: underline;\n    }\n  "])), size.pxToRem(size.space.XXS), current ? palette.MAIN : 'transparent', palette.TEXT_BLACK, current ? 'bold' : 'normal');
});
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=IndexNav.js.map