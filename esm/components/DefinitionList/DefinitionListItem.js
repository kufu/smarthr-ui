var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { Heading } from '../Heading';
export var DefinitionListItem = function (_a) {
    var term = _a.term, description = _a.description, _b = _a.termTag, termTag = _b === void 0 ? 'span' : _b, _c = _a.className, className = _c === void 0 ? '' : _c;
    var theme = useTheme();
    return (React.createElement(Wrapper, { className: className, themes: theme },
        React.createElement("dt", null,
            React.createElement(Heading, { tag: termTag, type: "subSubBlockTitle" }, term)),
        React.createElement(Content, { themes: theme }, description)));
};
var Wrapper = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var palette = themes.palette, size = themes.size;
    return css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      padding-bottom: ", ";\n      border-bottom: 1px dotted ", ";\n    "], ["\n      padding-bottom: ", ";\n      border-bottom: 1px dotted ", ";\n    "])), size.pxToRem(5), palette.BORDER);
});
var Content = styled.dd(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size, palette = themes.palette;
    return css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      margin: ", " 0 0;\n      padding: 0;\n      color: ", ";\n      font-size: ", ";\n      line-height: 1.5;\n    "], ["\n      margin: ", " 0 0;\n      padding: 0;\n      color: ", ";\n      font-size: ", ";\n      line-height: 1.5;\n    "])), size.pxToRem(5), palette.TEXT_BLACK, size.pxToRem(size.font.TALL));
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=DefinitionListItem.js.map