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
exports.RightFixedNoteItem = void 0;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var useTheme_1 = require("../../hooks/useTheme");
var Base_1 = require("../Base");
var Button_1 = require("../Button");
var Icon_1 = require("../Icon");
exports.RightFixedNoteItem = function (_a) {
    var id = _a.id, text = _a.text, date = _a.date, author = _a.author, onClickEdit = _a.onClickEdit, _b = _a.editLabel, editLabel = _b === void 0 ? '編集' : _b, className = _a.className;
    var theme = useTheme_1.useTheme();
    return (react_1.default.createElement(Wrapper, { themes: theme, className: className },
        react_1.default.createElement(TextBase, { themes: theme },
            react_1.default.createElement(EditButton, { size: "s", onClick: function (e) { return onClickEdit(e, id); }, square: true, "aria-label": editLabel },
                react_1.default.createElement(Icon_1.Icon, { name: "fa-pen" })),
            react_1.default.createElement(Text, { themes: theme }, text)),
        date && react_1.default.createElement(Info, { themes: theme }, date),
        author && react_1.default.createElement(Info, { themes: theme }, author)));
};
var Wrapper = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space;
    return styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      margin-bottom: ", ";\n    "], ["\n      margin-bottom: ", ";\n    "])), pxToRem(space.S));
});
var TextBase = styled_components_1.default(Base_1.Base)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space;
    return styled_components_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      padding: ", ";\n      margin-bottom: ", ";\n      overflow: hidden;\n    "], ["\n      padding: ", ";\n      margin-bottom: ", ";\n      overflow: hidden;\n    "])), pxToRem(space.XXS), pxToRem(space.XXS));
});
var Text = styled_components_1.default.p(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, font = _b.font, pxToRem = _b.pxToRem;
    return styled_components_1.css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n      display: block;\n      padding: 0;\n      margin: 0;\n      font-size: ", ";\n      line-height: 1.5;\n    "], ["\n      display: block;\n      padding: 0;\n      margin: 0;\n      font-size: ", ";\n      line-height: 1.5;\n    "])), pxToRem(font.TALL));
});
var EditButton = styled_components_1.default(Button_1.SecondaryButton)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  float: right;\n"], ["\n  float: right;\n"])));
var Info = styled_components_1.default.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size, palette = themes.palette;
    return styled_components_1.css(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n      color: ", ";\n      font-size: ", ";\n      text-align: right;\n    "], ["\n      color: ", ";\n      font-size: ", ";\n      text-align: right;\n    "])), palette.TEXT_GREY, size.pxToRem(size.font.SHORT));
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
//# sourceMappingURL=RightFixedNoteItem.js.map