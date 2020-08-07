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
import React, { useEffect } from 'react';
import styled, { css } from 'styled-components';
import { TertiaryLink } from './TertiaryLink';
import { validateElement } from './bottomFixedAreaHelper';
import { Base as BaseComponent } from '../Base';
import { useTheme } from '../../hooks/useTheme';
export var BottomFixedArea = function (props) {
    var theme = useTheme();
    var description = props.description, primaryButton = props.primaryButton, secondaryButton = props.secondaryButton, tertiaryLinks = props.tertiaryLinks, _a = props.zIndex, zIndex = _a === void 0 ? 500 : _a, _b = props.className, className = _b === void 0 ? '' : _b;
    useEffect(function () {
        validateElement(primaryButton, secondaryButton);
    }, [primaryButton, secondaryButton]);
    return (React.createElement(Base, { themes: theme, zIndex: zIndex, className: className },
        description && React.createElement(Text, null, description),
        (secondaryButton || primaryButton) && (React.createElement(ButtonList, { themes: theme },
            secondaryButton && React.createElement("li", null, secondaryButton),
            primaryButton && React.createElement("li", null, primaryButton))),
        tertiaryLinks && tertiaryLinks.length > 0 && (React.createElement(TertiaryList, { themes: theme }, tertiaryLinks.map(function (tertiaryLink, index) { return (React.createElement("li", { key: index },
            React.createElement(TertiaryLink, __assign({}, tertiaryLink)))); })))));
};
var Base = styled(BaseComponent)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes, zIndex = _a.zIndex;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space;
    return css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      display: flex;\n      flex-direction: column;\n      position: fixed;\n      bottom: 0;\n      width: 100%;\n      padding: ", ";\n      text-align: center;\n      z-index: ", ";\n    "], ["\n      display: flex;\n      flex-direction: column;\n      position: fixed;\n      bottom: 0;\n      width: 100%;\n      padding: ", ";\n      text-align: center;\n      z-index: ", ";\n    "])), pxToRem(space.S), zIndex);
});
var Text = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  margin: 0;\n"], ["\n  margin: 0;\n"])));
var ButtonList = styled.ul(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space;
    return css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      margin: ", " 0 0 0;\n      padding: 0;\n      display: flex;\n      justify-content: center;\n\n      > li {\n        list-style: none;\n        margin-right: ", ";\n\n        &:last-of-type {\n          margin-right: 0;\n        }\n      }\n    "], ["\n      margin: ", " 0 0 0;\n      padding: 0;\n      display: flex;\n      justify-content: center;\n\n      > li {\n        list-style: none;\n        margin-right: ", ";\n\n        &:last-of-type {\n          margin-right: 0;\n        }\n      }\n    "])), pxToRem(space.XS), pxToRem(space.XS));
});
var TertiaryList = styled.ul(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space;
    return css(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n      margin: ", " 0 0 0;\n      padding: 0;\n      display: flex;\n      justify-content: center;\n\n      > li {\n        list-style: none;\n        margin-right: ", ";\n\n        &:last-of-type {\n          margin-right: 0;\n        }\n      }\n    "], ["\n      margin: ", " 0 0 0;\n      padding: 0;\n      display: flex;\n      justify-content: center;\n\n      > li {\n        list-style: none;\n        margin-right: ", ";\n\n        &:last-of-type {\n          margin-right: 0;\n        }\n      }\n    "])), pxToRem(space.XS), pxToRem(space.XS));
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=BottomFixedArea.js.map