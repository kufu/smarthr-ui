var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { Base } from '../Base';
import { Icon } from '../Icon';
import { Heading } from '../Heading';
import { SecondaryButton } from '../Button';
export var InformationPanel = function (_a) {
    var title = _a.title, _b = _a.titleTag, titleTag = _b === void 0 ? 'span' : _b, _c = _a.type, type = _c === void 0 ? 'info' : _c, _d = _a.togglable, togglable = _d === void 0 ? true : _d, _e = _a.openButtonLabel, openButtonLabel = _e === void 0 ? '開く' : _e, _f = _a.closeButtonLabel, closeButtonLabel = _f === void 0 ? '閉じる' : _f, _g = _a.active, activeProps = _g === void 0 ? true : _g, _h = _a.className, className = _h === void 0 ? '' : _h, children = _a.children, onClickTrigger = _a.onClickTrigger;
    var theme = useTheme();
    var iconName = 'fa-info-circle';
    var iconColor = theme.palette.TEXT_GREY;
    switch (type) {
        case 'success':
            iconName = 'fa-check-circle';
            iconColor = theme.palette.MAIN;
            break;
        case 'info':
            iconName = 'fa-info-circle';
            iconColor = theme.palette.TEXT_GREY;
            break;
        case 'warning':
            iconName = 'fa-exclamation-triangle';
            iconColor = theme.palette.WARNING;
            break;
        case 'error':
            iconName = 'fa-exclamation-circle';
            iconColor = theme.palette.DANGER;
    }
    var _j = useState(activeProps), active = _j[0], setActive = _j[1];
    var handleClickTrigger = function () {
        if (onClickTrigger) {
            onClickTrigger(active);
        }
        else {
            setActive(!active);
        }
    };
    useEffect(function () {
        setActive(activeProps);
    }, [activeProps]);
    return (React.createElement(Wrapper, { className: className, themes: theme, "aria-expanded": active },
        React.createElement(Header, { themes: theme },
            React.createElement(Title, { themes: theme },
                React.createElement(TitleIcon, { name: iconName, color: iconColor, themes: theme }),
                React.createElement(StyledHeading, { type: "blockTitle", tag: titleTag }, title)),
            togglable && (React.createElement("div", null,
                React.createElement(SecondaryButton, { suffix: React.createElement(Icon, { size: 14, name: active ? 'fa-caret-up' : 'fa-caret-down' }), size: "s", onClick: handleClickTrigger }, active ? closeButtonLabel : openButtonLabel)))),
        active && React.createElement(Content, { themes: theme }, children)));
};
var Wrapper = styled(Base)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space;
    return css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      padding: ", ";\n      box-shadow: rgba(51, 51, 51, 0.3) 0px 4px 10px 0;\n    "], ["\n      padding: ", ";\n      box-shadow: rgba(51, 51, 51, 0.3) 0px 4px 10px 0;\n    "])), pxToRem(space.S));
});
var Header = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n"], ["\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n"])));
var Title = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  vertical-align: middle;\n  ", "\n"], ["\n  vertical-align: middle;\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space;
    return css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      margin-right: ", ";\n    "], ["\n      margin-right: ", ";\n    "])), pxToRem(space.XXS));
});
var TitleIcon = styled(Icon)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  vertical-align: text-top;\n  ", "\n"], ["\n  vertical-align: text-top;\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space;
    return css(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n      margin-right: ", ";\n    "], ["\n      margin-right: ", ";\n    "])), pxToRem(space.XXS));
});
var Content = styled.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space, font = _b.font;
    return css(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n      margin-top: ", ";\n      font-size: ", ";\n    "], ["\n      margin-top: ", ";\n      font-size: ", ";\n    "])), pxToRem(space.S), pxToRem(font.TALL));
});
var StyledHeading = styled(Heading)(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  display: inline;\n"], ["\n  display: inline;\n"])));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;
//# sourceMappingURL=InformationPanel.js.map