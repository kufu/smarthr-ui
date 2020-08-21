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
exports.FormGroup = void 0;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var useTheme_1 = require("../../hooks/useTheme");
var StatusLabel_1 = require("../StatusLabel");
var Heading_1 = require("../Heading");
var Icon_1 = require("../Icon");
exports.FormGroup = function (_a) {
    var label = _a.label, _b = _a.labelType, labelType = _b === void 0 ? 'blockTitle' : _b, labelId = _a.labelId, _c = _a.innerMargin, innerMargin = _c === void 0 ? 'XS' : _c, statusLabels = _a.statusLabels, helpMessage = _a.helpMessage, errorMessages = _a.errorMessages, children = _a.children, disabled = _a.disabled, className = _a.className;
    var theme = useTheme_1.useTheme();
    var disabledClass = disabled ? 'disabled' : '';
    return (react_1.default.createElement(Wrapper, { className: className + " " + disabledClass, themes: theme },
        react_1.default.createElement(Label, { themes: theme, id: labelId, margin: innerMargin },
            react_1.default.createElement(TitleWrapper, null,
                react_1.default.createElement(Title, { type: labelType, disabled: disabled }, label),
                statusLabels && (react_1.default.createElement(StatusLabels, { themes: theme }, statusLabels.map(function (StatusLabelItem, index) { return (react_1.default.createElement(LabelItem, { key: index, type: StatusLabelItem.type, className: StatusLabelItem.className, themes: theme }, StatusLabelItem.children)); })))),
            helpMessage && react_1.default.createElement(HelpMessage, { themes: theme }, helpMessage),
            errorMessages &&
                (typeof errorMessages === 'string' ? [errorMessages] : errorMessages).map(function (message, index) { return (react_1.default.createElement(ErrorMessage, { themes: theme, key: index },
                    react_1.default.createElement(ErrorIcon, { name: "fa-exclamation-circle", color: disabled ? theme.palette.TEXT_DISABLED : theme.palette.DANGER, themes: theme, size: 14 }),
                    react_1.default.createElement(ErrorText, null, message))); })),
        react_1.default.createElement(Body, null, children)));
};
var Wrapper = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var palette = themes.palette;
    return styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      display: block;\n\n      &.disabled {\n        color: ", ";\n      }\n    "], ["\n      display: block;\n\n      &.disabled {\n        color: ", ";\n      }\n    "])), palette.TEXT_DISABLED);
});
var Label = styled_components_1.default.label(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes, margin = _a.margin;
    var size = themes.size;
    return styled_components_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      display: block;\n      margin-bottom: ", ";\n    "], ["\n      display: block;\n      margin-bottom: ", ";\n    "])), size.pxToRem(size.space[margin]));
});
var TitleWrapper = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: flex;\n  align-items: baseline;\n  flex-wrap: wrap;\n"], ["\n  display: flex;\n  align-items: baseline;\n  flex-wrap: wrap;\n"])));
var Title = styled_components_1.default(Heading_1.Heading)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  display: inline-block;\n"], ["\n  display: inline-block;\n"])));
var StatusLabels = styled_components_1.default.span(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size;
    return styled_components_1.css(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n      margin-left: ", ";\n      display: inline-block;\n      line-height: 1;\n    "], ["\n      margin-left: ", ";\n      display: inline-block;\n      line-height: 1;\n    "])), size.pxToRem(size.space.XXS));
});
var LabelItem = styled_components_1.default(StatusLabel_1.StatusLabel)(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size;
    return styled_components_1.css(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n      margin-right: ", ";\n      display: inline-block;\n    "], ["\n      margin-right: ", ";\n      display: inline-block;\n    "])), size.pxToRem(4));
});
var HelpMessage = styled_components_1.default.div(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size;
    return styled_components_1.css(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n      margin-top: ", ";\n      font-size: ", ";\n    "], ["\n      margin-top: ", ";\n      font-size: ", ";\n    "])), size.pxToRem(size.space.XXS), size.pxToRem(size.font.TALL));
});
var ErrorMessage = styled_components_1.default.div(templateObject_14 || (templateObject_14 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size;
    return styled_components_1.css(templateObject_13 || (templateObject_13 = __makeTemplateObject(["\n      margin-top: ", ";\n      font-size: ", ";\n      line-height: 1;\n    "], ["\n      margin-top: ", ";\n      font-size: ", ";\n      line-height: 1;\n    "])), size.pxToRem(size.space.XXS), size.pxToRem(size.font.TALL));
});
var ErrorText = styled_components_1.default.span(templateObject_15 || (templateObject_15 = __makeTemplateObject(["\n  vertical-align: middle;\n"], ["\n  vertical-align: middle;\n"])));
var ErrorIcon = styled_components_1.default(Icon_1.Icon)(templateObject_17 || (templateObject_17 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size;
    return styled_components_1.css(templateObject_16 || (templateObject_16 = __makeTemplateObject(["\n      margin-right: ", ";\n      vertical-align: middle;\n    "], ["\n      margin-right: ", ";\n      vertical-align: middle;\n    "])), size.pxToRem(4));
});
var Body = styled_components_1.default.div(templateObject_18 || (templateObject_18 = __makeTemplateObject(["\n  display: block;\n"], ["\n  display: block;\n"])));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18;
//# sourceMappingURL=FormGroup.js.map