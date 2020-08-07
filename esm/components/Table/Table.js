var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React, { createContext } from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
export var TableGroupContext = createContext({
    group: 'body',
});
export var Table = function (_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b;
    var theme = useTheme();
    return (React.createElement(Wrapper, { themes: theme, className: className }, children));
};
var Wrapper = styled.table(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var COLUMN = themes.palette.COLUMN;
    return css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      width: 100%;\n      border-collapse: collapse;\n      border-spacing: 0;\n      background-color: ", ";\n\n      th {\n        background-color: ", ";\n      }\n    "], ["\n      width: 100%;\n      border-collapse: collapse;\n      border-spacing: 0;\n      background-color: ", ";\n\n      th {\n        background-color: ", ";\n      }\n    "])), COLUMN, COLUMN);
});
var templateObject_1, templateObject_2;
//# sourceMappingURL=Table.js.map