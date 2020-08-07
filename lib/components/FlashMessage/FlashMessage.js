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
exports.FlashMessage = void 0;
var react_1 = __importStar(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var useTheme_1 = require("../../hooks/useTheme");
var Icon_1 = require("../Icon");
var Button_1 = require("../Button");
var REMOVE_DELAY = 8000;
var timerId = 0;
exports.FlashMessage = function (_a) {
    var visible = _a.visible, type = _a.type, text = _a.text, onClose = _a.onClose, _b = _a.className, className = _b === void 0 ? '' : _b;
    var theme = useTheme_1.useTheme();
    react_1.useEffect(function () {
        if (visible) {
            timerId = setTimeout(onClose, REMOVE_DELAY);
        }
        else {
            clearTimeout(timerId);
        }
        return function () {
            clearTimeout(timerId);
        };
    }, [onClose, visible]);
    if (!visible)
        return null;
    var iconName = 'fa-check-circle';
    var iconColor = theme.palette.TEXT_GREY;
    switch (type) {
        case 'success':
            iconName = 'fa-check-circle';
            iconColor = theme.palette.MAIN;
            break;
        case 'info':
            iconName = 'fa-info-circle';
            iconColor = theme.palette.TEXT_GREY;
            break;
        case 'warning':
            iconName = 'fa-exclamation-triangle';
            iconColor = theme.palette.WARNING;
            break;
        case 'error':
            iconName = 'fa-exclamation-circle';
            iconColor = theme.palette.DANGER;
    }
    return (react_1.default.createElement(Wrapper, { className: type + " " + className, themes: theme },
        react_1.default.createElement(Icon_1.Icon, { name: iconName, size: 14, color: iconColor }),
        react_1.default.createElement(Txt, { themes: theme }, text),
        react_1.default.createElement(CloseButton, { className: "close", onClick: onClose, size: "s", square: true, themes: theme },
            react_1.default.createElement(Icon_1.Icon, { size: 16, name: "fa-times" }))));
};
var bounceAnimation = styled_components_1.keyframes(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  from,\n  20%,\n  53%,\n  80%,\n  to {\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n    transform: translate3d(0, 0, 0);\n  }\n  40%,\n  43% {\n    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);\n    transform: translate3d(0, -30px, 0);\n  }\n  70% {\n    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);\n    transform: translate3d(0, -15px, 0);\n  }\n  90% {\n    transform: translate3d(0, -4px, 0);\n  }\n"], ["\n  from,\n  20%,\n  53%,\n  80%,\n  to {\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n    transform: translate3d(0, 0, 0);\n  }\n  40%,\n  43% {\n    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);\n    transform: translate3d(0, -30px, 0);\n  }\n  70% {\n    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);\n    transform: translate3d(0, -15px, 0);\n  }\n  90% {\n    transform: translate3d(0, -4px, 0);\n  }\n"])));
var Wrapper = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size, frame = themes.frame, palette = themes.palette;
    return styled_components_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      z-index: 1000;\n      display: flex;\n      position: fixed;\n      bottom: ", ";\n      left: ", ";\n      box-sizing: border-box;\n      align-items: center;\n      min-width: ", ";\n      padding: ", ";\n      padding-right: ", ";\n      background-color: #fff;\n      border: 1px solid ", ";\n      border-radius: ", ";\n      box-shadow: 0 4px 10px 0 rgba(51, 51, 51, 0.3);\n      animation: ", " 1s 0s both;\n    "], ["\n      z-index: 1000;\n      display: flex;\n      position: fixed;\n      bottom: ", ";\n      left: ", ";\n      box-sizing: border-box;\n      align-items: center;\n      min-width: ", ";\n      padding: ", ";\n      padding-right: ", ";\n      background-color: #fff;\n      border: 1px solid ", ";\n      border-radius: ", ";\n      box-shadow: 0 4px 10px 0 rgba(51, 51, 51, 0.3);\n      animation: ", " 1s 0s both;\n    "])), size.pxToRem(size.space.XXS), size.pxToRem(size.space.XXS), size.pxToRem(200), size.pxToRem(size.space.XS), size.pxToRem(54), palette.BORDER, frame.border.radius.m, bounceAnimation);
});
var CloseButton = styled_components_1.default(Button_1.SecondaryButton)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space;
    return styled_components_1.css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      position: absolute;\n      top: 50%;\n      right: ", ";\n      transform: translateY(-50%);\n    "], ["\n      position: absolute;\n      top: 50%;\n      right: ", ";\n      transform: translateY(-50%);\n    "])), pxToRem(space.XXS));
});
var Txt = styled_components_1.default.p(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space, font = _b.font;
    return styled_components_1.css(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n      flex-grow: 1;\n      flex-shrink: 1;\n      padding: 0;\n      margin: 0 0 0 ", ";\n      font-size: ", ";\n      line-height: 1;\n    "], ["\n      flex-grow: 1;\n      flex-shrink: 1;\n      padding: 0;\n      margin: 0 0 0 ", ";\n      font-size: ", ";\n      line-height: 1;\n    "])), pxToRem(space.XXS), pxToRem(font.TALL));
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=FlashMessage.js.map