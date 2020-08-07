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
exports.TabItem = void 0;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var useTheme_1 = require("../../hooks/useTheme");
var ua_1 = require("../../libs/ua");
exports.TabItem = function (_a) {
    var id = _a.id, children = _a.children, onClick = _a.onClick, _b = _a.selected, selected = _b === void 0 ? false : _b, _c = _a.className, className = _c === void 0 ? '' : _c, _d = _a.disabled, disabled = _d === void 0 ? false : _d;
    var theme = useTheme_1.useTheme();
    var classNames = className + " " + (selected ? 'selected' : '');
    return (react_1.default.createElement(Wrapper, { role: "tab", "aria-selected": selected, className: classNames, onClick: function () { return onClick(id); }, disabled: disabled, themes: theme }, children));
};
var resetButtonStyle = styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background-color: transparent;\n  border: none;\n  cursor: pointer;\n  outline: none;\n  padding: 0;\n  appearance: none;\n"], ["\n  background-color: transparent;\n  border: none;\n  cursor: pointer;\n  outline: none;\n  padding: 0;\n  appearance: none;\n"])));
var Wrapper = styled_components_1.default.button(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  ", "\n  ", "\n"], ["\n  ", "\n  ",
    "\n"])), resetButtonStyle, function (_a) {
    var themes = _a.themes;
    var size = themes.size, palette = themes.palette, interaction = themes.interaction;
    return styled_components_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      font-weight: bold;\n      font-size: ", ";\n      color: ", ";\n      height: 40px;\n      border-bottom: solid 3px transparent;\n      padding: 0 ", ";\n      box-sizing: border-box;\n      transition: ", ";\n\n      &.selected {\n        color: ", ";\n        border-color: ", ";\n      }\n\n      :hover {\n        background-color: ", ";\n        color: ", ";\n      }\n\n      :disabled {\n        background-color: transparent;\n        color: ", ";\n        cursor: not-allowed;\n      }\n    "], ["\n      font-weight: bold;\n      font-size: ", ";\n      color: ", ";\n      height: 40px;\n      border-bottom: solid 3px transparent;\n      padding: 0 ", ";\n      box-sizing: border-box;\n      transition: ",
        ";\n\n      &.selected {\n        color: ", ";\n        border-color: ", ";\n      }\n\n      :hover {\n        background-color: ", ";\n        color: ", ";\n      }\n\n      :disabled {\n        background-color: transparent;\n        color: ", ";\n        cursor: not-allowed;\n      }\n    "])), size.pxToRem(size.font.TALL), palette.TEXT_GREY, size.pxToRem(size.space.S), ua_1.isTouchDevice
        ? 'none'
        : "background-color " + interaction.hover.animation + ", color " + interaction.hover.animation, palette.TEXT_BLACK, palette.MAIN, palette.COLUMN, palette.TEXT_BLACK, palette.disableColor(palette.TEXT_GREY));
});
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=TabItem.js.map