var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React, { useContext } from 'react';
import styled from 'styled-components';
import { DropdownContext } from './Dropdown';
export var DropdownTrigger = function (_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b;
    var _c = useContext(DropdownContext), active = _c.active, onClickTrigger = _c.onClickTrigger, triggerElementRef = _c.triggerElementRef;
    return (React.createElement(Wrapper, { ref: triggerElementRef, onClick: function (e) {
            var rect = e.currentTarget.getBoundingClientRect();
            onClickTrigger({
                top: rect.top,
                right: rect.right,
                bottom: rect.bottom,
                left: rect.left,
            });
        }, className: className }, React.Children.map(children, function (child) {
        var props = child.props ? child.props : {};
        var _a = props.className, classNameProps = _a === void 0 ? '' : _a;
        switch (typeof child) {
            case 'string':
                return child;
            case 'object':
                return React.cloneElement(child, {
                    className: (active ? 'active' : '') + " " + classNameProps,
                });
            default:
                return null;
        }
    })));
};
var Wrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: inline-block;\n"], ["\n  display: inline-block;\n"])));
var templateObject_1;
//# sourceMappingURL=DropdownTrigger.js.map