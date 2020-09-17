var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React, { useContext } from 'react';
import styled from 'styled-components';
import { DialogContext } from './DialogWrapper';
export var DialogTrigger = function (_a) {
    var children = _a.children;
    var onClickTrigger = useContext(DialogContext).onClickTrigger;
    return React.createElement(Wrapper, { onClick: onClickTrigger }, children);
};
var Wrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: inline-block;\n"], ["\n  display: inline-block;\n"])));
var templateObject_1;
//# sourceMappingURL=DialogTrigger.js.map