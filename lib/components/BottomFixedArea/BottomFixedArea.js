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
exports.BottomFixedArea = void 0;
var react_1 = __importStar(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var TertiaryLink_1 = require("./TertiaryLink");
var bottomFixedAreaHelper_1 = require("./bottomFixedAreaHelper");
var Base_1 = require("../Base");
var useTheme_1 = require("../../hooks/useTheme");
exports.BottomFixedArea = function (props) {
    var theme = useTheme_1.useTheme();
    var description = props.description, primaryButton = props.primaryButton, secondaryButton = props.secondaryButton, tertiaryLinks = props.tertiaryLinks, _a = props.zIndex, zIndex = _a === void 0 ? 500 : _a, _b = props.className, className = _b === void 0 ? '' : _b;
    react_1.useEffect(function () {
        bottomFixedAreaHelper_1.validateElement(primaryButton, secondaryButton);
    }, [primaryButton, secondaryButton]);
    return (react_1.default.createElement(Base, { themes: theme, zIndex: zIndex, className: className },
        description && react_1.default.createElement(Text, null, description),
        (secondaryButton || primaryButton) && (react_1.default.createElement(ButtonList, { themes: theme },
            secondaryButton && react_1.default.createElement("li", null, secondaryButton),
            primaryButton && react_1.default.createElement("li", null, primaryButton))),
        tertiaryLinks && tertiaryLinks.length > 0 && (react_1.default.createElement(TertiaryList, { themes: theme }, tertiaryLinks.map(function (tertiaryLink, index) { return (react_1.default.createElement("li", { key: index },
            react_1.default.createElement(TertiaryLink_1.TertiaryLink, __assign({}, tertiaryLink)))); })))));
};
var Base = styled_components_1.default(Base_1.Base)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes, zIndex = _a.zIndex;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space;
    return styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      display: flex;\n      flex-direction: column;\n      position: fixed;\n      bottom: 0;\n      width: 100%;\n      padding: ", ";\n      text-align: center;\n      z-index: ", ";\n    "], ["\n      display: flex;\n      flex-direction: column;\n      position: fixed;\n      bottom: 0;\n      width: 100%;\n      padding: ", ";\n      text-align: center;\n      z-index: ", ";\n    "])), pxToRem(space.S), zIndex);
});
var Text = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  margin: 0;\n"], ["\n  margin: 0;\n"])));
var ButtonList = styled_components_1.default.ul(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space;
    return styled_components_1.css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      margin: ", " 0 0 0;\n      padding: 0;\n      display: flex;\n      justify-content: center;\n\n      > li {\n        list-style: none;\n        margin-right: ", ";\n\n        &:last-of-type {\n          margin-right: 0;\n        }\n      }\n    "], ["\n      margin: ", " 0 0 0;\n      padding: 0;\n      display: flex;\n      justify-content: center;\n\n      > li {\n        list-style: none;\n        margin-right: ", ";\n\n        &:last-of-type {\n          margin-right: 0;\n        }\n      }\n    "])), pxToRem(space.XS), pxToRem(space.XS));
});
var TertiaryList = styled_components_1.default.ul(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space;
    return styled_components_1.css(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n      margin: ", " 0 0 0;\n      padding: 0;\n      display: flex;\n      justify-content: center;\n\n      > li {\n        list-style: none;\n        margin-right: ", ";\n\n        &:last-of-type {\n          margin-right: 0;\n        }\n      }\n    "], ["\n      margin: ", " 0 0 0;\n      padding: 0;\n      display: flex;\n      justify-content: center;\n\n      > li {\n        list-style: none;\n        margin-right: ", ";\n\n        &:last-of-type {\n          margin-right: 0;\n        }\n      }\n    "])), pxToRem(space.XS), pxToRem(space.XS));
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=BottomFixedArea.js.map