"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RightFixedNote = void 0;
var react_1 = __importStar(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var useTheme_1 = require("../../hooks/useTheme");
var RightFixedNoteItem_1 = require("./RightFixedNoteItem");
var Heading_1 = require("../Heading");
var Textarea_1 = require("../Textarea");
var Button_1 = require("../Button");
var TEXT_AREA_NAME = 'admin_memo_new_text';
exports.RightFixedNote = function (_a) {
    var title = _a.title, items = _a.items, _b = _a.submitLabel, submitLabel = _b === void 0 ? '送信' : _b, _c = _a.width, width = _c === void 0 ? 270 : _c, textareaLabel = _a.textareaLabel, onClickEdit = _a.onClickEdit, onSubmit = _a.onSubmit, className = _a.className;
    var theme = useTheme_1.useTheme();
    var handleSubmit = react_1.useCallback(function (e) {
        e.preventDefault();
        var formData = new FormData(e.currentTarget);
        var newText = (formData.get(TEXT_AREA_NAME) || '');
        onSubmit(e, newText);
    }, [onSubmit]);
    return (react_1.default.createElement(Wrapper, { themes: theme, width: width, onSubmit: handleSubmit, className: className },
        title && (react_1.default.createElement(Title, { type: "sectionTitle", themes: theme }, title)),
        items &&
            items.map(function (item) { return (react_1.default.createElement(RightFixedNoteItem_1.RightFixedNoteItem, __assign({ key: item.id }, item, { onClickEdit: onClickEdit }))); }),
        react_1.default.createElement(TextArea, { name: TEXT_AREA_NAME, themes: theme, "aria-label": textareaLabel ? textareaLabel : title }),
        react_1.default.createElement(SubmitButton, { type: "submit" }, submitLabel)));
};
var Wrapper = styled_components_1.default.form(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes, width = _a.width;
    var size = themes.size, palette = themes.palette;
    return styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      width: ", ";\n      padding: ", ";\n      background-color: ", ";\n      box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 8px;\n      overflow: hidden scroll;\n      position: fixed;\n      top: 0;\n      right: 0;\n      bottom: 0;\n    "], ["\n      width: ", ";\n      padding: ", ";\n      background-color: ", ";\n      box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 8px;\n      overflow: hidden scroll;\n      position: fixed;\n      top: 0;\n      right: 0;\n      bottom: 0;\n    "])), size.pxToRem(width), size.pxToRem(size.space.XS), palette.COLUMN);
});
var Title = styled_components_1.default(Heading_1.Heading)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space;
    return styled_components_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      display: block;\n      margin-bottom: ", ";\n    "], ["\n      display: block;\n      margin-bottom: ", ";\n    "])), pxToRem(space.XS));
});
var TextArea = styled_components_1.default(Textarea_1.Textarea)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space;
    return styled_components_1.css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n      display: block;\n      width: 100%;\n      max-width: 100%;\n      min-width: 100%;\n      box-sizing: border-box;\n      margin-bottom: ", ";\n    "], ["\n      display: block;\n      width: 100%;\n      max-width: 100%;\n      min-width: 100%;\n      box-sizing: border-box;\n      margin-bottom: ", ";\n    "])), pxToRem(space.XS));
});
var SubmitButton = styled_components_1.default(Button_1.SecondaryButton)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  display: block;\n  float: right;\n"], ["\n  display: block;\n  float: right;\n"])));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=RightFixedNote.js.map