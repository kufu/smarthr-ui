var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
export var TabBar = function (_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b, _c = _a.bordered, bordered = _c === void 0 ? true : _c, children = _a.children;
    var theme = useTheme();
    var classNames = className + " " + (bordered ? 'bordered' : '');
    return (React.createElement(Wrapper, { role: "tablist", className: classNames, themes: theme }, children));
};
var Wrapper = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var border = themes.frame.border;
    return css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      display: flex;\n\n      &.bordered {\n        position: relative;\n\n        :after {\n          position: absolute;\n          left: 0;\n          right: 0;\n          bottom: 0px;\n          border-bottom: ", ";\n          content: '';\n        }\n\n        > button {\n          &.selected {\n            position: relative;\n            z-index: 1;\n          }\n        }\n      }\n    "], ["\n      display: flex;\n\n      &.bordered {\n        position: relative;\n\n        :after {\n          position: absolute;\n          left: 0;\n          right: 0;\n          bottom: 0px;\n          border-bottom: ", ";\n          content: '';\n        }\n\n        > button {\n          &.selected {\n            position: relative;\n            z-index: 1;\n          }\n        }\n      }\n    "])), border.default);
});
var templateObject_1, templateObject_2;
//# sourceMappingURL=TabBar.js.map