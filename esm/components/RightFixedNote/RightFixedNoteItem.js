var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { Base } from '../Base';
import { SecondaryButton } from '../Button';
import { Icon } from '../Icon';
export var RightFixedNoteItem = function (_a) {
    var id = _a.id, text = _a.text, date = _a.date, author = _a.author, onClickEdit = _a.onClickEdit, _b = _a.editLabel, editLabel = _b === void 0 ? '編集' : _b, className = _a.className;
    var theme = useTheme();
    return (React.createElement(Wrapper, { themes: theme, className: className },
        React.createElement(TextBase, { themes: theme },
            React.createElement(EditButton, { size: "s", onClick: function (e) { return onClickEdit(e, id); }, square: true, "aria-label": editLabel },
                React.createElement(Icon, { name: "fa-pen" })),
            React.createElement(Text, { themes: theme }, text)),
        date && React.createElement(Info, { themes: theme }, date),
        author && React.createElement(Info, { themes: theme }, author)));
};
var Wrapper = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space;
    return css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      margin-bottom: ", ";\n    "], ["\n      margin-bottom: ", ";\n    "])), pxToRem(space.S));
});
var TextBase = styled(Base)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space;
    return css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      padding: ", ";\n      margin-bottom: ", ";\n      overflow: hidden;\n    "], ["\n      padding: ", ";\n      margin-bottom: ", ";\n      overflow: hidden;\n    "])), pxToRem(space.XXS), pxToRem(space.XXS));
});
var Text = styled.p(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, font = _b.font, pxToRem = _b.pxToRem;
    return css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n      display: block;\n      padding: 0;\n      margin: 0;\n      font-size: ", ";\n      line-height: 1.5;\n    "], ["\n      display: block;\n      padding: 0;\n      margin: 0;\n      font-size: ", ";\n      line-height: 1.5;\n    "])), pxToRem(font.TALL));
});
var EditButton = styled(SecondaryButton)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  float: right;\n"], ["\n  float: right;\n"])));
var Info = styled.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size, palette = themes.palette;
    return css(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n      color: ", ";\n      font-size: ", ";\n      text-align: right;\n    "], ["\n      color: ", ";\n      font-size: ", ";\n      text-align: right;\n    "])), palette.TEXT_GREY, size.pxToRem(size.font.SHORT));
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
//# sourceMappingURL=RightFixedNoteItem.js.map