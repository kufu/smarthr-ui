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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccordionPanelTrigger = void 0;
var react_1 = __importStar(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var useTheme_1 = require("../../hooks/useTheme");
var map_1 = require("../../libs/map");
var ua_1 = require("../../libs/ua");
var accordionPanelHelper_1 = require("./accordionPanelHelper");
var AccordionPanel_1 = require("./AccordionPanel");
var AccordionPanelItem_1 = require("./AccordionPanelItem");
var Icon_1 = require("../Icon");
exports.AccordionPanelTrigger = function (_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b;
    var theme = useTheme_1.useTheme();
    var name = react_1.useContext(AccordionPanelItem_1.AccordionPanelItemContext).name;
    var _c = react_1.useContext(AccordionPanel_1.AccordionPanelContext), iconPosition = _c.iconPosition, displayIcon = _c.displayIcon, expandedItems = _c.expandedItems, onClickTrigger = _c.onClickTrigger, onClickProps = _c.onClickProps, expandableMultiply = _c.expandableMultiply;
    var isExpanded = map_1.getIsInclude(expandedItems, name);
    var expandedClassName = isExpanded ? 'expanded' : '';
    var buttonClassNames = className + " " + expandedClassName + " " + iconPosition;
    var iconClassNames = expandedClassName + " " + iconPosition;
    var handleClick = react_1.useCallback(function () {
        if (onClickTrigger)
            onClickTrigger(name, !isExpanded);
        if (onClickProps) {
            var newExpandedItems = accordionPanelHelper_1.getNewExpandedItems(expandedItems, name, !isExpanded, expandableMultiply);
            onClickProps(map_1.mapToKeyArray(newExpandedItems));
        }
    }, [onClickTrigger, name, isExpanded, onClickProps, expandedItems, expandableMultiply]);
    var caretIcon = react_1.default.createElement(Icon, { className: iconClassNames, name: "fa-caret-down", themes: theme });
    return (react_1.default.createElement(Button, { id: name + "-trigger", className: buttonClassNames, "aria-expanded": isExpanded, "aria-controls": name + "-content", themes: theme, onClick: handleClick },
        displayIcon && iconPosition === 'left' && caretIcon,
        children,
        displayIcon && iconPosition === 'right' && caretIcon));
};
var resetButtonStyle = styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background-color: transparent;\n  border: none;\n  outline: none;\n  padding: 0;\n  appearance: none;\n"], ["\n  background-color: transparent;\n  border: none;\n  outline: none;\n  padding: 0;\n  appearance: none;\n"])));
var Button = styled_components_1.default.button(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  ", "\n  ", "\n"], ["\n  ", "\n  ",
    "\n"])), resetButtonStyle, function (_a) {
    var themes = _a.themes;
    var size = themes.size, palette = themes.palette, interaction = themes.interaction;
    return styled_components_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      display: flex;\n      align-items: center;\n      width: 100%;\n      padding: ", " ", ";\n      color: ", ";\n      font-size: ", ";\n      text-align: left;\n      cursor: pointer;\n      transition: ", ";\n\n      &:hover {\n        background-color: ", ";\n      }\n      &.right {\n        justify-content: space-between;\n      }\n      &.left {\n        justify-content: left;\n      }\n    "], ["\n      display: flex;\n      align-items: center;\n      width: 100%;\n      padding: ", " ", ";\n      color: ", ";\n      font-size: ", ";\n      text-align: left;\n      cursor: pointer;\n      transition: ", ";\n\n      &:hover {\n        background-color: ", ";\n      }\n      &.right {\n        justify-content: space-between;\n      }\n      &.left {\n        justify-content: left;\n      }\n    "])), size.pxToRem(12), size.pxToRem(size.space.XS), palette.TEXT_BLACK, size.pxToRem(size.font.TALL), ua_1.isTouchDevice ? 'none' : "all " + interaction.hover.animation, palette.hoverColor('#fff'));
});
var Icon = styled_components_1.default(Icon_1.Icon)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size;
    return styled_components_1.css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      display: inline-flex;\n      margin-right: ", ";\n      transition: transform 0.3s;\n\n      &.left {\n        &.expanded {\n          transform: rotate(-180deg);\n        }\n      }\n\n      &.right {\n        margin-right: 0;\n        margin-left: ", ";\n\n        &.expanded {\n          transform: rotate(180deg);\n        }\n      }\n    "], ["\n      display: inline-flex;\n      margin-right: ", ";\n      transition: transform 0.3s;\n\n      &.left {\n        &.expanded {\n          transform: rotate(-180deg);\n        }\n      }\n\n      &.right {\n        margin-right: 0;\n        margin-left: ", ";\n\n        &.expanded {\n          transform: rotate(180deg);\n        }\n      }\n    "])), size.pxToRem(size.space.XXS), size.pxToRem(size.space.XXS));
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=AccordionPanelTrigger.js.map