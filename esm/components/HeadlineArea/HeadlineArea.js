var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { Heading } from '../Heading';
export var HeadlineArea = function (_a) {
    var heading = _a.heading, description = _a.description, _b = _a.className, className = _b === void 0 ? '' : _b;
    var theme = useTheme();
    return (React.createElement(Wrapper, { theme: theme, className: className },
        React.createElement(Heading, { type: "screenTitle", tag: heading.tag ? heading.tag : 'h1' }, heading.children),
        description && React.createElement(Description, { themes: theme }, description)));
};
var Wrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: block;\n  margin: 0;\n  padding: 0;\n"], ["\n  display: block;\n  margin: 0;\n  padding: 0;\n"])));
var Description = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size, palette = themes.palette;
    return css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      margin-top: ", ";\n      color: ", ";\n      font-size: ", ";\n      line-height: 1.5;\n    "], ["\n      margin-top: ", ";\n      color: ", ";\n      font-size: ", ";\n      line-height: 1.5;\n    "])), size.pxToRem(size.space.XS), palette.TEXT_BLACK, size.pxToRem(size.font.TALL));
});
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=HeadlineArea.js.map