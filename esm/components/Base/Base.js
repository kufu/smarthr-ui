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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
export var Base = forwardRef(function (_a, ref) {
    var _b = _a.radius, radius = _b === void 0 ? 'm' : _b, props = __rest(_a, ["radius"]);
    var radiusMap = {
        s: '6px',
        m: '8px',
    };
    return React.createElement(Wrapper, __assign({ radius: radiusMap[radius], ref: ref }, props));
});
var Wrapper = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var radius = _a.radius;
    return css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      border-radius: ", ";\n      box-shadow: rgba(51, 51, 51, 0.3) 1px 1px 4px 0;\n      background-color: #fff;\n    "], ["\n      border-radius: ", ";\n      box-shadow: rgba(51, 51, 51, 0.3) 1px 1px 4px 0;\n      background-color: #fff;\n    "])), radius);
});
var templateObject_1, templateObject_2;
//# sourceMappingURL=Base.js.map