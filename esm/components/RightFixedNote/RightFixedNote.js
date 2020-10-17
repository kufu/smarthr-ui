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
import React, { useCallback } from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { RightFixedNoteItem } from './RightFixedNoteItem';
import { Heading } from '../Heading';
import { Textarea } from '../Textarea';
import { SecondaryButton } from '../Button';
var TEXT_AREA_NAME = 'admin_memo_new_text';
export var RightFixedNote = function (_a) {
    var title = _a.title, items = _a.items, _b = _a.submitLabel, submitLabel = _b === void 0 ? '送信' : _b, _c = _a.width, width = _c === void 0 ? 270 : _c, _d = _a.enableEdit, enableEdit = _d === void 0 ? true : _d, textareaLabel = _a.textareaLabel, onClickEdit = _a.onClickEdit, onSubmit = _a.onSubmit, className = _a.className;
    var theme = useTheme();
    var handleSubmit = useCallback(function (e) {
        e.preventDefault();
        var formData = new FormData(e.currentTarget);
        var newText = (formData.get(TEXT_AREA_NAME) || '');
        onSubmit(e, newText);
    }, [onSubmit]);
    return (React.createElement(Wrapper, { themes: theme, width: width, onSubmit: handleSubmit, className: className },
        title && (React.createElement(Title, { type: "sectionTitle", themes: theme }, title)),
        items &&
            items.map(function (item) { return (React.createElement(RightFixedNoteItem, __assign({ key: item.id }, item, { showEditButton: enableEdit, onClickEdit: onClickEdit }))); }),
        React.createElement(TextArea, { name: TEXT_AREA_NAME, themes: theme, "aria-label": textareaLabel ? textareaLabel : title }),
        React.createElement(SubmitButton, { type: "submit" }, submitLabel)));
};
var Wrapper = styled.form(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes, width = _a.width;
    var size = themes.size, palette = themes.palette;
    return css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      width: ", ";\n      padding: ", ";\n      background-color: ", ";\n      box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 8px;\n      overflow: hidden scroll;\n      position: fixed;\n      top: 0;\n      right: 0;\n      bottom: 0;\n    "], ["\n      width: ", ";\n      padding: ", ";\n      background-color: ", ";\n      box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 8px;\n      overflow: hidden scroll;\n      position: fixed;\n      top: 0;\n      right: 0;\n      bottom: 0;\n    "])), size.pxToRem(width), size.pxToRem(size.space.XS), palette.COLUMN);
});
var Title = styled(Heading)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space;
    return css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      display: block;\n      margin-bottom: ", ";\n    "], ["\n      display: block;\n      margin-bottom: ", ";\n    "])), pxToRem(space.XS));
});
var TextArea = styled(Textarea)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space;
    return css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n      display: block;\n      width: 100%;\n      max-width: 100%;\n      min-width: 100%;\n      box-sizing: border-box;\n      margin-bottom: ", ";\n    "], ["\n      display: block;\n      width: 100%;\n      max-width: 100%;\n      min-width: 100%;\n      box-sizing: border-box;\n      margin-bottom: ", ";\n    "])), pxToRem(space.XS));
});
var SubmitButton = styled(SecondaryButton)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  display: block;\n  float: right;\n"], ["\n  display: block;\n  float: right;\n"])));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=RightFixedNote.js.map