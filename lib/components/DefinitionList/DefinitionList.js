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
exports.DefinitionList = void 0;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var useTheme_1 = require("../../hooks/useTheme");
var DefinitionListItem_1 = require("./DefinitionListItem");
exports.DefinitionList = function (_a) {
    var items = _a.items, _b = _a.layout, layout = _b === void 0 ? 'single' : _b, _c = _a.className, className = _c === void 0 ? '' : _c;
    var theme = useTheme_1.useTheme();
    return (react_1.default.createElement(Wrapper, { className: className, layout: layout }, items.map(function (item, index) { return (react_1.default.createElement(Item, { term: item.term, description: item.description, key: index, layout: layout, className: item.className && item.className, themes: theme })); })));
};
var Wrapper = styled_components_1.default.dl(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var layout = _a.layout;
    var baseStyle = styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      padding: 0;\n      margin: 0;\n    "], ["\n      padding: 0;\n      margin: 0;\n    "])));
    var flexStyle = styled_components_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      display: flex;\n      justify-content: space-between;\n      align-items: flex-start;\n      align-content: flex-start;\n      flex-wrap: wrap;\n    "], ["\n      display: flex;\n      justify-content: space-between;\n      align-items: flex-start;\n      align-content: flex-start;\n      flex-wrap: wrap;\n    "])));
    switch (layout) {
        case 'double':
            return styled_components_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n          ", "\n          ", "\n        "], ["\n          ", "\n          ", "\n        "])), baseStyle, flexStyle);
        case 'triple':
            return styled_components_1.css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n          ", "\n          ", "\n          &:after {\n            content: '';\n            display: block;\n            flex-basis: calc(33.333333% - 12px);\n          }\n        "], ["\n          ", "\n          ", "\n          &:after {\n            content: '';\n            display: block;\n            flex-basis: calc(33.333333% - 12px);\n          }\n        "])), baseStyle, flexStyle);
        default:
            return styled_components_1.css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n          ", "\n          display: block;\n        "], ["\n          ", "\n          display: block;\n        "])), baseStyle);
    }
});
var Item = styled_components_1.default(DefinitionListItem_1.DefinitionListItem)(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes, layout = _a.layout;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space;
    var basicStyle = styled_components_1.css(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n      margin-bottom: ", ";\n    "], ["\n      margin-bottom: ", ";\n    "])), pxToRem(space.S));
    switch (layout) {
        case 'double':
            return styled_components_1.css(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n          ", "\n          flex-basis: calc(50% - 12px);\n\n          &:last-child,\n          &:nth-last-child(2) {\n            margin-bottom: 0;\n          }\n        "], ["\n          ", "\n          flex-basis: calc(50% - 12px);\n\n          &:last-child,\n          &:nth-last-child(2) {\n            margin-bottom: 0;\n          }\n        "])), basicStyle);
        case 'triple':
            return styled_components_1.css(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n          ", "\n          flex-basis: calc(33.333333% - 12px);\n\n          &:last-child,\n          &:nth-last-child(2),\n          &:nth-last-child(3) {\n            margin-bottom: 0;\n          }\n        "], ["\n          ", "\n          flex-basis: calc(33.333333% - 12px);\n\n          &:last-child,\n          &:nth-last-child(2),\n          &:nth-last-child(3) {\n            margin-bottom: 0;\n          }\n        "])), basicStyle);
        default:
            return styled_components_1.css(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n          ", "\n\n          &:last-child {\n            margin-bottom: 0;\n          }\n        "], ["\n          ", "\n\n          &:last-child {\n            margin-bottom: 0;\n          }\n        "])), basicStyle);
    }
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11;
//# sourceMappingURL=DefinitionList.js.map