var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React, { useContext } from 'react';
import styled, { css } from 'styled-components';
import { DropdownContentContext } from './DropdownContent';
import { DropdownContentInnerContext } from './DropdownContentInner';
export var DropdownCloser = function (_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b;
    var _c = useContext(DropdownContentContext), onClickCloser = _c.onClickCloser, controllable = _c.controllable, scrollable = _c.scrollable;
    var maxHeight = useContext(DropdownContentInnerContext).maxHeight;
    return (React.createElement(Wrapper, { className: className, onClick: onClickCloser, maxHeight: maxHeight, controllable: controllable, scrollable: scrollable }, children));
};
var Wrapper = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var maxHeight = _a.maxHeight, controllable = _a.controllable, scrollable = _a.scrollable;
    return css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      ", "\n      ", "\n    "], ["\n      ",
        "\n      ", "\n    "])), !controllable
        ? "\n      display: flex;\n      flex-direction: column;\n      "
        : '', !controllable && scrollable ? "max-height: " + maxHeight + ";" : '');
});
var templateObject_1, templateObject_2;
//# sourceMappingURL=DropdownCloser.js.map