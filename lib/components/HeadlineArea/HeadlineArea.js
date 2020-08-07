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
exports.HeadlineArea = void 0;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var useTheme_1 = require("../../hooks/useTheme");
var Heading_1 = require("../Heading");
exports.HeadlineArea = function (_a) {
    var heading = _a.heading, description = _a.description, _b = _a.className, className = _b === void 0 ? '' : _b;
    var theme = useTheme_1.useTheme();
    return (react_1.default.createElement(Wrapper, { theme: theme, className: className },
        react_1.default.createElement(Heading_1.Heading, { type: "screenTitle", tag: heading.tag ? heading.tag : 'h1' }, heading.children),
        description && react_1.default.createElement(Description, { themes: theme }, description)));
};
var Wrapper = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: block;\n  margin: 0;\n  padding: 0;\n"], ["\n  display: block;\n  margin: 0;\n  padding: 0;\n"])));
var Description = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size, palette = themes.palette;
    return styled_components_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      margin-top: ", ";\n      color: ", ";\n      font-size: ", ";\n      line-height: 1.5;\n    "], ["\n      margin-top: ", ";\n      color: ", ";\n      font-size: ", ";\n      line-height: 1.5;\n    "])), size.pxToRem(size.space.XS), palette.TEXT_BLACK, size.pxToRem(size.font.TALL));
});
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=HeadlineArea.js.map