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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionDialogContentInner = void 0;
var react_1 = __importStar(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var useTheme_1 = require("../../hooks/useTheme");
var dialogHelper_1 = require("./dialogHelper");
var Button_1 = require("../Button");
exports.ActionDialogContentInner = function (_a) {
    var children = _a.children, title = _a.title, closeText = _a.closeText, actionText = _a.actionText, actionTheme = _a.actionTheme, onClickAction = _a.onClickAction, onClickClose = _a.onClickClose, _b = _a.actionDisabled, actionDisabled = _b === void 0 ? false : _b;
    var theme = useTheme_1.useTheme();
    var handleClickAction = react_1.useCallback(function () {
        onClickAction(onClickClose);
    }, [onClickAction, onClickClose]);
    var _c = dialogHelper_1.useOffsetHeight(), offsetHeight = _c.offsetHeight, titleRef = _c.titleRef, bottomRef = _c.bottomRef;
    var ActionButton = Button_1.PrimaryButton;
    if (actionTheme === 'secondary')
        ActionButton = Button_1.SecondaryButton;
    if (actionTheme === 'danger')
        ActionButton = Button_1.DangerButton;
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Title, { themes: theme, ref: titleRef }, title),
        react_1.default.createElement(Body, { offsetHeight: offsetHeight }, children),
        react_1.default.createElement(Bottom, { themes: theme, ref: bottomRef },
            react_1.default.createElement(Button_1.SecondaryButton, { onClick: onClickClose }, closeText),
            react_1.default.createElement(ActionButton, { onClick: handleClickAction, disabled: actionDisabled }, actionText))));
};
var Title = styled_components_1.default.p(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space, font = _b.font;
    var border = themes.frame.border;
    return styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      margin: 0;\n      padding: ", " ", ";\n      border-bottom: ", ";\n      font-size: ", ";\n      line-height: 1;\n    "], ["\n      margin: 0;\n      padding: ", " ", ";\n      border-bottom: ", ";\n      font-size: ", ";\n      line-height: 1;\n    "])), pxToRem(space.XS), pxToRem(space.S), border.default, pxToRem(font.GRANDE));
});
var Body = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var offsetHeight = _a.offsetHeight;
    return styled_components_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      max-height: calc(100vh - ", "px);\n      overflow: auto;\n    "], ["\n      max-height: calc(100vh - ", "px);\n      overflow: auto;\n    "])), offsetHeight);
});
var Bottom = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space;
    var border = themes.frame.border;
    return styled_components_1.css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n      display: flex;\n      justify-content: flex-end;\n      margin: 0;\n      padding: ", " ", ";\n      border-top: ", ";\n\n      & > *:not(:first-child) {\n        margin: 0 0 0 ", ";\n      }\n    "], ["\n      display: flex;\n      justify-content: flex-end;\n      margin: 0;\n      padding: ", " ", ";\n      border-top: ", ";\n\n      & > *:not(:first-child) {\n        margin: 0 0 0 ", ";\n      }\n    "])), pxToRem(space.XS), pxToRem(space.S), border.default, pxToRem(space.XS));
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=ActionDialogContentInner.js.map