var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React, { useContext } from 'react';
import styled from 'styled-components';
import { DialogContentContext } from './DialogContent';
export var DialogCloser = function (_a) {
    var children = _a.children;
    var onClickClose = useContext(DialogContentContext).onClickClose;
    return React.createElement(Wrapper, { onClick: onClickClose }, children);
};
var Wrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: inline-block;\n"], ["\n  display: inline-block;\n"])));
var templateObject_1;
//# sourceMappingURL=DialogCloser.js.map