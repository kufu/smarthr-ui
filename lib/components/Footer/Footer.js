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
exports.Footer = void 0;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var useTheme_1 = require("../../hooks/useTheme");
exports.Footer = function () {
    var theme = useTheme_1.useTheme();
    return (react_1.default.createElement(Wrapper, { themes: theme },
        react_1.default.createElement(List, { themes: theme },
            react_1.default.createElement("li", null,
                react_1.default.createElement(Item, { href: "https://smarthr.jp/help", target: "_blank", rel: "noopener noreferrer" }, "\u30D8\u30EB\u30D7")),
            react_1.default.createElement("li", null,
                react_1.default.createElement(Item, { href: "https://smarthr.jp/info", target: "_blank", rel: "noopener noreferrer" }, "\u304A\u77E5\u3089\u305B")),
            react_1.default.createElement("li", null,
                react_1.default.createElement(Item, { href: "https://smarthr.jp/terms", target: "_blank", rel: "noopener noreferrer" }, "\u5229\u7528\u898F\u7D04")),
            react_1.default.createElement("li", null,
                react_1.default.createElement(Item, { href: "https://smarthr.jp/policy", target: "_blank", rel: "noopener noreferrer" }, "\u30D7\u30E9\u30A4\u30D0\u30B7\u30FC\u30DD\u30EA\u30B7\u30FC")),
            react_1.default.createElement("li", null,
                react_1.default.createElement(Item, { href: "https://smarthr.jp/law", target: "_blank", rel: "noopener noreferrer" }, "\u7279\u5B9A\u5546\u53D6\u5F15\u6CD5\u306B\u57FA\u3065\u304F\u8868\u8A18")),
            react_1.default.createElement("li", null,
                react_1.default.createElement(Item, { href: "https://smarthr.co.jp", target: "_blank", rel: "noopener noreferrer" }, "\u904B\u55B6\u4F1A\u793E")),
            react_1.default.createElement("li", null,
                react_1.default.createElement(Item, { href: "https://developer.smarthr.jp", target: "_blank", rel: "noopener noreferrer" }, "\u958B\u767A\u8005\u5411\u3051API"))),
        react_1.default.createElement(Copy, { themes: theme }, "\u00A9 SmartHR, Inc.")));
};
var Wrapper = styled_components_1.default.footer(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    return styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    height: 60px;\n    padding: 0 ", ";\n    background-color: ", ";\n    color: #fff;\n    font-size: ", ";\n  "], ["\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    height: 60px;\n    padding: 0 ", ";\n    background-color: ", ";\n    color: #fff;\n    font-size: ", ";\n  "])), themes.size.pxToRem(themes.size.space.S), themes.palette.HEADER_GREEN, themes.size.pxToRem(themes.size.font.TALL));
});
var List = styled_components_1.default.ul(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    return styled_components_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    display: flex;\n    align-items: center;\n    margin: 0;\n    padding: 0;\n    list-style: none;\n\n    > li:not(:first-child) {\n      margin-left: ", ";\n    }\n  "], ["\n    display: flex;\n    align-items: center;\n    margin: 0;\n    padding: 0;\n    list-style: none;\n\n    > li:not(:first-child) {\n      margin-left: ", ";\n    }\n  "])), themes.size.pxToRem(themes.size.space.XXS));
});
var Item = styled_components_1.default.a(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  color: #fff;\n  text-decoration: none;\n\n  &:hover {\n    text-decoration: underline;\n  }\n"], ["\n  color: #fff;\n  text-decoration: none;\n\n  &:hover {\n    text-decoration: underline;\n  }\n"])));
var Copy = styled_components_1.default.small(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    return styled_components_1.css(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n    font-size: ", ";\n  "], ["\n    font-size: ", ";\n  "])), themes.size.pxToRem(themes.size.font.TALL));
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=Footer.js.map