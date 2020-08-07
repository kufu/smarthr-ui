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
exports.MessageDialogContentInner = void 0;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var useTheme_1 = require("../../hooks/useTheme");
var dialogHelper_1 = require("./dialogHelper");
var Button_1 = require("../Button");
exports.MessageDialogContentInner = function (_a) {
    var title = _a.title, description = _a.description, closeText = _a.closeText, onClickClose = _a.onClickClose;
    var theme = useTheme_1.useTheme();
    var _b = dialogHelper_1.useOffsetHeight(), offsetHeight = _b.offsetHeight, titleRef = _b.titleRef, bottomRef = _b.bottomRef;
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Title, { themes: theme, ref: titleRef }, title),
        react_1.default.createElement(Description, { themes: theme, offsetHeight: offsetHeight }, description),
        react_1.default.createElement(Bottom, { themes: theme, ref: bottomRef },
            react_1.default.createElement(Button_1.SecondaryButton, { onClick: onClickClose }, closeText))));
};
var Title = styled_components_1.default.p(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space, font = _b.font;
    return styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      margin: 0;\n      padding: ", " ", " ", ";\n      font-size: ", ";\n      line-height: 1;\n    "], ["\n      margin: 0;\n      padding: ", " ", " ", ";\n      font-size: ", ";\n      line-height: 1;\n    "])), pxToRem(space.XS), pxToRem(space.S), pxToRem(space.S), pxToRem(font.GRANDE));
});
var Description = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes, offsetHeight = _a.offsetHeight;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space, font = _b.font;
    return styled_components_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      max-height: calc(100vh - ", "px);\n      overflow: auto;\n      padding: 0 ", ";\n      font-size: ", ";\n      line-height: 1.5;\n    "], ["\n      max-height: calc(100vh - ", "px);\n      overflow: auto;\n      padding: 0 ", ";\n      font-size: ", ";\n      line-height: 1.5;\n    "])), offsetHeight, pxToRem(space.S), pxToRem(font.TALL));
});
var Bottom = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space;
    return styled_components_1.css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n      display: flex;\n      justify-content: flex-end;\n      padding: ", " ", " ", ";\n    "], ["\n      display: flex;\n      justify-content: flex-end;\n      padding: ", " ", " ", ";\n    "])), pxToRem(space.S), pxToRem(space.S), pxToRem(space.XS));
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=MessageDialogContentInner.js.map