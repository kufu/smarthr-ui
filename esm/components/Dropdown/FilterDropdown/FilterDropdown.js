var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../../hooks/useTheme';
import { Dropdown } from '../Dropdown';
import { DropdownTrigger } from '../DropdownTrigger';
import { DropdownContent } from '../DropdownContent';
import { DropdownCloser } from '../DropdownCloser';
import { DropdownScrollArea } from '../DropdownScrollArea';
import { PrimaryButton, SecondaryButton, TextButton } from '../../Button';
import { Icon } from '../../Icon';
export var FilterDropdown = function (_a) {
    var _b = _a.isFiltered, isFiltered = _b === void 0 ? false : _b, onApply = _a.onApply, onCancel = _a.onCancel, onReset = _a.onReset, children = _a.children;
    var themes = useTheme();
    return (React.createElement(Dropdown, null,
        React.createElement(TriggerButtonWrapper, { themes: themes, isFiltered: isFiltered },
            React.createElement(DropdownTrigger, null,
                React.createElement(SecondaryButton, { suffix: React.createElement(Icon, { name: "fa-caret-down" }) }, "\u7D5E\u308A\u8FBC\u307F"))),
        React.createElement(DropdownContent, { controllable: true },
            React.createElement(DropdownScrollArea, null,
                React.createElement(ContentLayout, null, children)),
            React.createElement(BottomLayout, { themes: themes },
                onReset && (React.createElement(ResetButtonLayout, null,
                    React.createElement(TextButton, { size: "s", prefix: React.createElement(Icon, { name: "fa-undo-alt" }), onClick: function () { return onReset(); } }, "\u7D5E\u308A\u8FBC\u307F\u6761\u4EF6\u3092\u89E3\u9664"))),
                React.createElement(RightButtonLayout, null,
                    React.createElement(DropdownCloser, null,
                        React.createElement(SecondaryButton, { onClick: function () { return onCancel === null || onCancel === void 0 ? void 0 : onCancel(); } }, "\u30AD\u30E3\u30F3\u30BB\u30EB")),
                    React.createElement(DropdownCloser, null,
                        React.createElement(PrimaryButton, { onClick: function () { return onApply(); } }, "\u9069\u7528")))))));
};
var TriggerButtonWrapper = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes, isFiltered = _a.isFiltered;
    return isFiltered && css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      button {\n        border-color: ", ";\n      }\n    "], ["\n      button {\n        border-color: ", ";\n      }\n    "])), themes.palette.WARNING);
});
var ContentLayout = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  padding: 24px;\n"], ["\n  padding: 24px;\n"])));
var BottomLayout = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: flex;\n  align-items: center;\n  border-top: 1px solid ", ";\n  padding: 16px 24px;\n"], ["\n  display: flex;\n  align-items: center;\n  border-top: 1px solid ", ";\n  padding: 16px 24px;\n"])), function (_a) {
    var themes = _a.themes;
    return themes.palette.BORDER;
});
var ResetButtonLayout = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  margin-left: -8px;\n"], ["\n  margin-left: -8px;\n"])));
var RightButtonLayout = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  display: flex;\n  margin-left: auto;\n  & > *:not(:first-child) {\n    margin-left: 16px;\n  }\n"], ["\n  display: flex;\n  margin-left: auto;\n  & > *:not(:first-child) {\n    margin-left: 16px;\n  }\n"])));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=FilterDropdown.js.map