"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterDropdown = void 0;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var useTheme_1 = require("../../../hooks/useTheme");
var Dropdown_1 = require("../Dropdown");
var DropdownTrigger_1 = require("../DropdownTrigger");
var DropdownContent_1 = require("../DropdownContent");
var DropdownCloser_1 = require("../DropdownCloser");
var DropdownScrollArea_1 = require("../DropdownScrollArea");
var Button_1 = require("../../Button");
var Icon_1 = require("../../Icon");
exports.FilterDropdown = function (_a) {
    var _b = _a.isFiltered, isFiltered = _b === void 0 ? false : _b, onApply = _a.onApply, onCancel = _a.onCancel, onReset = _a.onReset, children = _a.children;
    var themes = useTheme_1.useTheme();
    return (react_1.default.createElement(Dropdown_1.Dropdown, null,
        react_1.default.createElement(TriggerButtonWrapper, { themes: themes, isFiltered: isFiltered },
            react_1.default.createElement(DropdownTrigger_1.DropdownTrigger, null,
                react_1.default.createElement(Button_1.SecondaryButton, { suffix: react_1.default.createElement(Icon_1.Icon, { name: "fa-caret-down" }) }, "\u7D5E\u308A\u8FBC\u307F"))),
        react_1.default.createElement(DropdownContent_1.DropdownContent, { controllable: true },
            react_1.default.createElement(DropdownScrollArea_1.DropdownScrollArea, null,
                react_1.default.createElement(ContentLayout, null, children)),
            react_1.default.createElement(BottomLayout, { themes: themes },
                onReset && (react_1.default.createElement(ResetButtonLayout, null,
                    react_1.default.createElement(Button_1.TextButton, { size: "s", prefix: react_1.default.createElement(Icon_1.Icon, { name: "fa-undo-alt" }), onClick: function () { return onReset(); } }, "\u7D5E\u308A\u8FBC\u307F\u6761\u4EF6\u3092\u89E3\u9664"))),
                react_1.default.createElement(RightButtonLayout, null,
                    react_1.default.createElement(DropdownCloser_1.DropdownCloser, null,
                        react_1.default.createElement(Button_1.SecondaryButton, { onClick: function () { return onCancel === null || onCancel === void 0 ? void 0 : onCancel(); } }, "\u30AD\u30E3\u30F3\u30BB\u30EB")),
                    react_1.default.createElement(DropdownCloser_1.DropdownCloser, null,
                        react_1.default.createElement(Button_1.PrimaryButton, { onClick: function () { return onApply(); } }, "\u9069\u7528")))))));
};
var TriggerButtonWrapper = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes, isFiltered = _a.isFiltered;
    return isFiltered && styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      button {\n        border-color: ", ";\n      }\n    "], ["\n      button {\n        border-color: ", ";\n      }\n    "])), themes.palette.WARNING);
});
var ContentLayout = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  padding: 24px;\n"], ["\n  padding: 24px;\n"])));
var BottomLayout = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: flex;\n  align-items: center;\n  border-top: 1px solid ", ";\n  padding: 16px 24px;\n"], ["\n  display: flex;\n  align-items: center;\n  border-top: 1px solid ", ";\n  padding: 16px 24px;\n"])), function (_a) {
    var themes = _a.themes;
    return themes.palette.BORDER;
});
var ResetButtonLayout = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  margin-left: -8px;\n"], ["\n  margin-left: -8px;\n"])));
var RightButtonLayout = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  display: flex;\n  margin-left: auto;\n  & > *:not(:first-child) {\n    margin-left: 16px;\n  }\n"], ["\n  display: flex;\n  margin-left: auto;\n  & > *:not(:first-child) {\n    margin-left: 16px;\n  }\n"])));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=FilterDropdown.js.map