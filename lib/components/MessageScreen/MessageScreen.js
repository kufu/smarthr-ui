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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageScreen = void 0;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var useTheme_1 = require("../../hooks/useTheme");
var SmartHRLogo_1 = require("../SmartHRLogo");
var Footer_1 = require("../Footer");
var Icon_1 = require("../Icon");
var LOGO_HEIGHT = 20;
exports.MessageScreen = function (_a) {
    var title = _a.title, links = _a.links, children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b;
    var theme = useTheme_1.useTheme();
    return (react_1.default.createElement(Wrapper, { themes: theme, className: className },
        react_1.default.createElement(Box, null,
            react_1.default.createElement(Logo, null,
                react_1.default.createElement(SmartHRLogo_1.SmartHRLogo, { width: 111, height: LOGO_HEIGHT, fill: theme.palette.BRAND })),
            title && react_1.default.createElement(Title, { themes: theme }, title),
            children && react_1.default.createElement(Content, { themes: theme }, children),
            links && links.length && (react_1.default.createElement(Links, { themes: theme }, links.map(function (link) { return (react_1.default.createElement("li", { key: link.label },
                react_1.default.createElement(Link, __assign({ href: link.url }, (link.target ? { target: link.target } : {}), { themes: theme }),
                    link.label,
                    link.target === '_blank' && react_1.default.createElement(ExternalIcon, { color: theme.palette.TEXT_LINK })))); })))),
        react_1.default.createElement(FooterArea, null,
            react_1.default.createElement(Footer_1.Footer, null))));
};
var Wrapper = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var palette = themes.palette;
    return styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      display: flex;\n      justify-content: center;\n      align-items: center;\n      height: 100vh;\n      background-color: ", ";\n    "], ["\n      display: flex;\n      justify-content: center;\n      align-items: center;\n      height: 100vh;\n      background-color: ", ";\n    "])), palette.BACKGROUND);
});
var Box = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n"], ["\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n"])));
var Logo = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  height: ", "px;\n"], ["\n  height: ", "px;\n"])), LOGO_HEIGHT);
var Title = styled_components_1.default.h1(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size, palette = themes.palette;
    var pxToRem = size.pxToRem, space = size.space, font = size.font;
    return styled_components_1.css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n      margin: ", " 0 0;\n      background-color: ", ";\n      color: ", ";\n      font-weight: normal;\n      font-size: ", "px;\n      line-height: 1;\n    "], ["\n      margin: ", " 0 0;\n      background-color: ", ";\n      color: ", ";\n      font-weight: normal;\n      font-size: ", "px;\n      line-height: 1;\n    "])), pxToRem(space.S), palette.BACKGROUND, palette.TEXT_BLACK, font.VENTI);
});
var Content = styled_components_1.default.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space;
    return styled_components_1.css(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n      margin-top: ", ";\n    "], ["\n      margin-top: ", ";\n    "])), pxToRem(space.XS));
});
var Links = styled_components_1.default.ul(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space;
    return styled_components_1.css(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n      margin: ", " 0 0;\n      padding: 0;\n      list-style: none;\n      text-align: center;\n      line-height: 1;\n\n      > li:not(:first-child) {\n        margin-top: ", ";\n      }\n    "], ["\n      margin: ", " 0 0;\n      padding: 0;\n      list-style: none;\n      text-align: center;\n      line-height: 1;\n\n      > li:not(:first-child) {\n        margin-top: ", ";\n      }\n    "])), pxToRem(space.XS), pxToRem(space.XS));
});
var Link = styled_components_1.default.a(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var palette = themes.palette, size = themes.size;
    return styled_components_1.css(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n      color: ", ";\n      font-size: ", "px;\n      line-height: 1.4;\n      text-decoration: none;\n\n      &:hover {\n        text-decoration: underline;\n      }\n    "], ["\n      color: ", ";\n      font-size: ", "px;\n      line-height: 1.4;\n      text-decoration: none;\n\n      &:hover {\n        text-decoration: underline;\n      }\n    "])), palette.TEXT_LINK, size.font.TALL);
});
var ExternalIcon = styled_components_1.default(Icon_1.Icon).attrs(function () { return ({
    name: 'fa-external-link-alt',
    size: 14,
}); })(templateObject_13 || (templateObject_13 = __makeTemplateObject(["\n  margin-left: 0.4rem;\n  vertical-align: -1px;\n"], ["\n  margin-left: 0.4rem;\n  vertical-align: -1px;\n"])));
var FooterArea = styled_components_1.default.div(templateObject_14 || (templateObject_14 = __makeTemplateObject(["\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n"], ["\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n"])));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14;
//# sourceMappingURL=MessageScreen.js.map