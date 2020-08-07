var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled from 'styled-components';
export var DropdownScrollArea = function (_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b;
    return (React.createElement(Wrapper, { className: className }, children));
};
var Wrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  overflow-y: auto;\n  flex: 1 1 auto;\n\n  /* IE11 */\n  /* stylelint-disable-next-line selector-type-no-unknown */\n  _:-ms-lang(x)::-ms-backdrop,\n  & {\n    max-height: 300px;\n  }\n"], ["\n  overflow-y: auto;\n  flex: 1 1 auto;\n\n  /* IE11 */\n  /* stylelint-disable-next-line selector-type-no-unknown */\n  _:-ms-lang(x)::-ms-backdrop,\n  & {\n    max-height: 300px;\n  }\n"])));
var templateObject_1;
//# sourceMappingURL=DropdownScrollArea.js.map