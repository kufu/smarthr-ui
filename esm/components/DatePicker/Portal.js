var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled, { css } from 'styled-components';
export var Portal = function (_a) {
    var top = _a.top, left = _a.left, children = _a.children;
    var root = useRef(document.createElement('div')).current;
    useEffect(function () {
        document.body.appendChild(root);
        return function () {
            document.body.removeChild(root);
        };
    }, [root]);
    return createPortal(React.createElement(Container, { top: top, left: left }, children), root);
};
var Container = styled.div(function (_a) {
    var top = _a.top, left = _a.left;
    return css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    position: absolute;\n    top: ", "px;\n    left: ", "px;\n    z-index: 11000;\n  "], ["\n    position: absolute;\n    top: ", "px;\n    left: ", "px;\n    z-index: 11000;\n  "])), top, left);
});
var templateObject_1;
//# sourceMappingURL=Portal.js.map