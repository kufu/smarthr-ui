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
exports.TabBar = void 0;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var useTheme_1 = require("../../hooks/useTheme");
exports.TabBar = function (_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b, _c = _a.bordered, bordered = _c === void 0 ? true : _c, children = _a.children;
    var theme = useTheme_1.useTheme();
    var classNames = className + " " + (bordered ? 'bordered' : '');
    return (react_1.default.createElement(Wrapper, { role: "tablist", className: classNames, themes: theme }, children));
};
var Wrapper = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var border = themes.frame.border;
    return styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      display: flex;\n\n      &.bordered {\n        position: relative;\n\n        :after {\n          position: absolute;\n          left: 0;\n          right: 0;\n          bottom: 0px;\n          border-bottom: ", ";\n          content: '';\n        }\n\n        > button {\n          &.selected {\n            position: relative;\n            z-index: 1;\n          }\n        }\n      }\n    "], ["\n      display: flex;\n\n      &.bordered {\n        position: relative;\n\n        :after {\n          position: absolute;\n          left: 0;\n          right: 0;\n          bottom: 0px;\n          border-bottom: ", ";\n          content: '';\n        }\n\n        > button {\n          &.selected {\n            position: relative;\n            z-index: 1;\n          }\n        }\n      }\n    "])), border.default);
});
var templateObject_1, templateObject_2;
//# sourceMappingURL=TabBar.js.map