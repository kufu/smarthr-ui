var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { StatusLabel } from '../StatusLabel';
import { Heading } from '../Heading';
import { Icon } from '../Icon';
export var FormGroup = function (_a) {
    var label = _a.label, _b = _a.labelType, labelType = _b === void 0 ? 'blockTitle' : _b, labelId = _a.labelId, _c = _a.innerMargin, innerMargin = _c === void 0 ? 'XS' : _c, statusLabels = _a.statusLabels, helpMessage = _a.helpMessage, errorMessages = _a.errorMessages, children = _a.children, disabled = _a.disabled, className = _a.className;
    var theme = useTheme();
    var disabledClass = disabled ? 'disabled' : '';
    return (React.createElement(Wrapper, { className: className + " " + disabledClass, themes: theme },
        React.createElement(Label, { themes: theme, id: labelId, margin: innerMargin },
            React.createElement(TitleWrapper, null,
                React.createElement(Title, { type: labelType, disabled: disabled }, label),
                statusLabels && (React.createElement(StatusLabels, { themes: theme }, statusLabels.map(function (StatusLabelItem, index) { return (React.createElement(LabelItem, { key: index, type: StatusLabelItem.type, className: StatusLabelItem.className, themes: theme }, StatusLabelItem.children)); })))),
            helpMessage && React.createElement(HelpMessage, { themes: theme }, helpMessage),
            errorMessages &&
                (typeof errorMessages === 'string' ? [errorMessages] : errorMessages).map(function (message) { return (React.createElement(ErrorMessage, { themes: theme, key: message },
                    React.createElement(ErrorIcon, { name: "fa-exclamation-circle", color: disabled ? theme.palette.TEXT_DISABLED : theme.palette.DANGER, themes: theme, size: 14 }),
                    React.createElement(ErrorText, null, message))); })),
        React.createElement(Body, null, children)));
};
var Wrapper = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var palette = themes.palette;
    return css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      display: block;\n\n      &.disabled {\n        color: ", ";\n      }\n    "], ["\n      display: block;\n\n      &.disabled {\n        color: ", ";\n      }\n    "])), palette.TEXT_DISABLED);
});
var Label = styled.label(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes, margin = _a.margin;
    var size = themes.size;
    return css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      display: block;\n      margin-bottom: ", ";\n    "], ["\n      display: block;\n      margin-bottom: ", ";\n    "])), size.pxToRem(size.space[margin]));
});
var TitleWrapper = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: flex;\n  align-items: baseline;\n  flex-wrap: wrap;\n"], ["\n  display: flex;\n  align-items: baseline;\n  flex-wrap: wrap;\n"])));
var Title = styled(Heading)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  display: inline-block;\n"], ["\n  display: inline-block;\n"])));
var StatusLabels = styled.span(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size;
    return css(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n      margin-left: ", ";\n      display: inline-block;\n      line-height: 1;\n    "], ["\n      margin-left: ", ";\n      display: inline-block;\n      line-height: 1;\n    "])), size.pxToRem(size.space.XXS));
});
var LabelItem = styled(StatusLabel)(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size;
    return css(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n      margin-right: ", ";\n      display: inline-block;\n    "], ["\n      margin-right: ", ";\n      display: inline-block;\n    "])), size.pxToRem(4));
});
var HelpMessage = styled.div(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size;
    return css(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n      margin-top: ", ";\n      font-size: ", ";\n    "], ["\n      margin-top: ", ";\n      font-size: ", ";\n    "])), size.pxToRem(size.space.XXS), size.pxToRem(size.font.TALL));
});
var ErrorMessage = styled.div(templateObject_14 || (templateObject_14 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size;
    return css(templateObject_13 || (templateObject_13 = __makeTemplateObject(["\n      margin-top: ", ";\n      font-size: ", ";\n      line-height: 1;\n    "], ["\n      margin-top: ", ";\n      font-size: ", ";\n      line-height: 1;\n    "])), size.pxToRem(size.space.XXS), size.pxToRem(size.font.TALL));
});
var ErrorText = styled.span(templateObject_15 || (templateObject_15 = __makeTemplateObject(["\n  vertical-align: middle;\n"], ["\n  vertical-align: middle;\n"])));
var ErrorIcon = styled(Icon)(templateObject_17 || (templateObject_17 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size;
    return css(templateObject_16 || (templateObject_16 = __makeTemplateObject(["\n      margin-right: ", ";\n      vertical-align: middle;\n    "], ["\n      margin-right: ", ";\n      vertical-align: middle;\n    "])), size.pxToRem(4));
});
var Body = styled.div(templateObject_18 || (templateObject_18 = __makeTemplateObject(["\n  display: block;\n"], ["\n  display: block;\n"])));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18;
//# sourceMappingURL=FormGroup.js.map