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
import * as React from 'react';
import styled from 'styled-components';
import { TableGroupContext } from './Table';
export var Body = function (props) { return (React.createElement(Wrapper, __assign({}, props),
    React.createElement(TableGroupContext.Provider, { value: { group: 'body' } }, props.children))); };
var Wrapper = styled.tbody(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background-color: #fff;\n"], ["\n  background-color: #fff;\n"])));
var templateObject_1;
//# sourceMappingURL=Body.js.map