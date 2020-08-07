var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled, { css, keyframes } from 'styled-components';
export var Loader = function (_a) {
    var _b = _a.color, color = _b === void 0 ? '#fff' : _b, _c = _a.size, size = _c === void 0 ? 'm' : _c, _d = _a.className, className = _d === void 0 ? '' : _d;
    return (React.createElement(Wrapper, { className: size + " " + className, color: color },
        React.createElement("div", null),
        React.createElement("div", null),
        React.createElement("div", null),
        React.createElement("div", null),
        React.createElement("div", null)));
};
var lineScale = keyframes(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  0%, 100% {\n    transform: scaleY(1);\n  }\n  50% {\n    transform: scaleY(0.4);\n  }\n"], ["\n  0%, 100% {\n    transform: scaleY(1);\n  }\n  50% {\n    transform: scaleY(0.4);\n  }\n"])));
var Wrapper = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var color = _a.color;
    return css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    display: inline-block;\n\n    &.s {\n      transform: scale(0.8);\n    }\n    &.l {\n      transform: scale(1.2);\n    }\n\n    & > div {\n      display: inline-block;\n      width: 4px;\n      height: 35px;\n      border-radius: 2px;\n      margin: 2px;\n      background-color: ", ";\n\n      &:nth-child(1) {\n        animation: ", " 1s -0.4s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);\n      }\n      &:nth-child(2) {\n        animation: ", " 1s -0.3s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);\n      }\n      &:nth-child(3) {\n        animation: ", " 1s -0.2s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);\n      }\n      &:nth-child(4) {\n        animation: ", " 1s -0.1s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);\n      }\n      &:nth-child(5) {\n        animation: ", " 1s 0s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);\n      }\n    }\n  "], ["\n    display: inline-block;\n\n    &.s {\n      transform: scale(0.8);\n    }\n    &.l {\n      transform: scale(1.2);\n    }\n\n    & > div {\n      display: inline-block;\n      width: 4px;\n      height: 35px;\n      border-radius: 2px;\n      margin: 2px;\n      background-color: ", ";\n\n      &:nth-child(1) {\n        animation: ", " 1s -0.4s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);\n      }\n      &:nth-child(2) {\n        animation: ", " 1s -0.3s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);\n      }\n      &:nth-child(3) {\n        animation: ", " 1s -0.2s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);\n      }\n      &:nth-child(4) {\n        animation: ", " 1s -0.1s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);\n      }\n      &:nth-child(5) {\n        animation: ", " 1s 0s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);\n      }\n    }\n  "])), color, lineScale, lineScale, lineScale, lineScale, lineScale);
});
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=Loader.js.map