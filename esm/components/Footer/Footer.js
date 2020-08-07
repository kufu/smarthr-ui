var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
export var Footer = function () {
    var theme = useTheme();
    return (React.createElement(Wrapper, { themes: theme },
        React.createElement(List, { themes: theme },
            React.createElement("li", null,
                React.createElement(Item, { href: "https://smarthr.jp/help", target: "_blank", rel: "noopener noreferrer" }, "\u30D8\u30EB\u30D7")),
            React.createElement("li", null,
                React.createElement(Item, { href: "https://smarthr.jp/info", target: "_blank", rel: "noopener noreferrer" }, "\u304A\u77E5\u3089\u305B")),
            React.createElement("li", null,
                React.createElement(Item, { href: "https://smarthr.jp/terms", target: "_blank", rel: "noopener noreferrer" }, "\u5229\u7528\u898F\u7D04")),
            React.createElement("li", null,
                React.createElement(Item, { href: "https://smarthr.jp/policy", target: "_blank", rel: "noopener noreferrer" }, "\u30D7\u30E9\u30A4\u30D0\u30B7\u30FC\u30DD\u30EA\u30B7\u30FC")),
            React.createElement("li", null,
                React.createElement(Item, { href: "https://smarthr.jp/law", target: "_blank", rel: "noopener noreferrer" }, "\u7279\u5B9A\u5546\u53D6\u5F15\u6CD5\u306B\u57FA\u3065\u304F\u8868\u8A18")),
            React.createElement("li", null,
                React.createElement(Item, { href: "https://smarthr.co.jp", target: "_blank", rel: "noopener noreferrer" }, "\u904B\u55B6\u4F1A\u793E")),
            React.createElement("li", null,
                React.createElement(Item, { href: "https://developer.smarthr.jp", target: "_blank", rel: "noopener noreferrer" }, "\u958B\u767A\u8005\u5411\u3051API"))),
        React.createElement(Copy, { themes: theme }, "\u00A9 SmartHR, Inc.")));
};
var Wrapper = styled.footer(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    return css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    height: 60px;\n    padding: 0 ", ";\n    background-color: ", ";\n    color: #fff;\n    font-size: ", ";\n  "], ["\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    height: 60px;\n    padding: 0 ", ";\n    background-color: ", ";\n    color: #fff;\n    font-size: ", ";\n  "])), themes.size.pxToRem(themes.size.space.S), themes.palette.HEADER_GREEN, themes.size.pxToRem(themes.size.font.TALL));
});
var List = styled.ul(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    return css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    display: flex;\n    align-items: center;\n    margin: 0;\n    padding: 0;\n    list-style: none;\n\n    > li:not(:first-child) {\n      margin-left: ", ";\n    }\n  "], ["\n    display: flex;\n    align-items: center;\n    margin: 0;\n    padding: 0;\n    list-style: none;\n\n    > li:not(:first-child) {\n      margin-left: ", ";\n    }\n  "])), themes.size.pxToRem(themes.size.space.XXS));
});
var Item = styled.a(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  color: #fff;\n  text-decoration: none;\n\n  &:hover {\n    text-decoration: underline;\n  }\n"], ["\n  color: #fff;\n  text-decoration: none;\n\n  &:hover {\n    text-decoration: underline;\n  }\n"])));
var Copy = styled.small(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    return css(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n    font-size: ", ";\n  "], ["\n    font-size: ", ";\n  "])), themes.size.pxToRem(themes.size.font.TALL));
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=Footer.js.map