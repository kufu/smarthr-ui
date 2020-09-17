var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { Dropdown, DropdownContent, DropdownTrigger } from '../Dropdown';
import { Icon } from '../Icon';
export var HeaderUserDropdown = function (_a) {
    var isAdmin = _a.isAdmin, isCrew = _a.isCrew, displayName = _a.displayName, currentTenantName = _a.currentTenantName, avatar = _a.avatar, showLogout = _a.showLogout, onClickAccount = _a.onClickAccount, onClickLogout = _a.onClickLogout, onClickProfile = _a.onClickProfile, onClickCompany = _a.onClickCompany, onClickSchool = _a.onClickSchool;
    var theme = useTheme();
    return (React.createElement(Dropdown, null,
        React.createElement(DropdownTrigger, null,
            React.createElement(TriggerButton, { themes: theme },
                avatar && (React.createElement(Avatar, { src: avatar, width: 20, height: 20, alt: displayName + 'の写真', themes: theme })),
                displayName,
                React.createElement(CaretIcon, { themes: theme, role: "presentation" },
                    React.createElement(Icon, { name: "fa-caret-down", color: "#fff" })))),
        React.createElement(DropdownContent, null,
            React.createElement(MenuList, { themes: theme, role: "menu" },
                React.createElement(MenuListItem, { role: "menuitem" },
                    React.createElement(MenuListItemHeader, { themes: theme }, displayName)),
                isCrew && (React.createElement(MenuListItem, { role: "menuitem" },
                    React.createElement(MenuListItemButton, { onClick: onClickProfile, themes: theme },
                        React.createElement(MenuListItemIcon, { themes: theme },
                            React.createElement(Icon, { name: "fa-user-alt" })),
                        "\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB\u306E\u78BA\u8A8D"))),
                React.createElement(MenuListItem, { role: "menuitem" },
                    React.createElement(MenuListItemButton, { onClick: onClickAccount, themes: theme },
                        React.createElement(MenuListItemIcon, { themes: theme },
                            React.createElement(Icon, { name: "fa-cog" })),
                        "\u500B\u4EBA\u8A2D\u5B9A")),
                isAdmin && (React.createElement(React.Fragment, null,
                    React.createElement(MenuListItem, { role: "menuitem" },
                        React.createElement(MenuListItemDivider, { themes: theme, role: "separator" })),
                    React.createElement(MenuListItem, { role: "menuitem" },
                        React.createElement(MenuListItemHeader, { themes: theme }, currentTenantName)),
                    React.createElement(MenuListItem, { role: "menuitem" },
                        React.createElement(MenuListItemButton, { onClick: onClickCompany, themes: theme },
                            React.createElement(MenuListItemIcon, { themes: theme },
                                React.createElement(Icon, { name: "fa-building" })),
                            "\u5171\u901A\u8A2D\u5B9A")))),
                React.createElement(MenuListItem, { role: "menuitem" },
                    React.createElement(MenuListItemDivider, { themes: theme, role: "separator" })),
                isAdmin && (React.createElement(MenuListItem, { role: "menuitem" },
                    React.createElement(MenuListItemButton, { onClick: onClickSchool, themes: theme },
                        React.createElement(MenuListItemIcon, { themes: theme },
                            React.createElement(Icon, { name: "fa-graduation-cap" })),
                        "SmartHR \u30B9\u30AF\u30FC\u30EB"))),
                showLogout && (React.createElement(MenuListItem, { role: "menuitem" },
                    React.createElement(MenuListItemButton, { onClick: onClickLogout, themes: theme },
                        React.createElement(MenuListItemIcon, { themes: theme },
                            React.createElement(Icon, { name: "fa-power-off" })),
                        "\u30ED\u30B0\u30A2\u30A6\u30C8")))))));
};
var TriggerButton = styled.button(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size, interaction = themes.interaction;
    return css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      display: flex;\n      align-items: center;\n      height: 50px;\n      margin: 0;\n      padding: 0 ", ";\n      border: none;\n      background: none;\n      color: #fff;\n      font-size: ", ";\n      transition: background-color ", ";\n      cursor: pointer;\n\n      &:hover {\n        background-color: rgba(255, 255, 255, 0.3);\n      }\n    "], ["\n      display: flex;\n      align-items: center;\n      height: 50px;\n      margin: 0;\n      padding: 0 ", ";\n      border: none;\n      background: none;\n      color: #fff;\n      font-size: ", ";\n      transition: background-color ", ";\n      cursor: pointer;\n\n      &:hover {\n        background-color: rgba(255, 255, 255, 0.3);\n      }\n    "])), size.pxToRem(10), size.pxToRem(size.font.TALL), interaction.hover.animation);
});
var Avatar = styled.img(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", ";\n"], ["\n  ",
    ";\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size;
    return css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      border-radius: 4px;\n      margin-right: ", ";\n    "], ["\n      border-radius: 4px;\n      margin-right: ", ";\n    "])), size.pxToRem(size.space.XXS));
});
var CaretIcon = styled.figure(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size;
    return css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n      display: inline-block;\n      padding: 0;\n      margin: 0 0 0 ", ";\n      vertical-align: middle;\n    "], ["\n      display: inline-block;\n      padding: 0;\n      margin: 0 0 0 ", ";\n      vertical-align: middle;\n    "])), size.pxToRem(size.space.XXS));
});
var MenuList = styled.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size, frame = themes.frame;
    return css(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n      border: ", ";\n      border-radius: ", ";\n      background-color: #fff;\n      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);\n      padding: ", " 0;\n    "], ["\n      border: ", ";\n      border-radius: ", ";\n      background-color: #fff;\n      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);\n      padding: ", " 0;\n    "])), frame.border.default, frame.border.radius.s, size.pxToRem(5));
});
var MenuListItem = styled.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  margin: 0;\n  padding: 0;\n"], ["\n  margin: 0;\n  padding: 0;\n"])));
var MenuListItemIcon = styled.figure(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size;
    return css(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n      display: flex;\n      align-items: center;\n      padding: 0;\n      margin: 0 ", " 0 0;\n    "], ["\n      display: flex;\n      align-items: center;\n      padding: 0;\n      margin: 0 ", " 0 0;\n    "])), size.pxToRem(size.space.XXS));
});
var MenuListItemButton = styled.button(templateObject_13 || (templateObject_13 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size, palette = themes.palette, interaction = themes.interaction;
    return css(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n      display: flex;\n      align-items: center;\n      width: 100%;\n      padding: ", " ", ";\n      border: none;\n      background: none;\n      color: ", ";\n      font-size: ", ";\n      line-height: 1.5;\n      white-space: nowrap;\n      box-sizing: border-box;\n      transition: background-color ", ";\n      cursor: pointer;\n\n      &:hover {\n        background-color: ", ";\n      }\n    "], ["\n      display: flex;\n      align-items: center;\n      width: 100%;\n      padding: ", " ", ";\n      border: none;\n      background: none;\n      color: ", ";\n      font-size: ", ";\n      line-height: 1.5;\n      white-space: nowrap;\n      box-sizing: border-box;\n      transition: background-color ", ";\n      cursor: pointer;\n\n      &:hover {\n        background-color: ", ";\n      }\n    "])), size.pxToRem(3), size.pxToRem(20), palette.TEXT_BLACK, size.pxToRem(size.font.TALL), interaction.hover.animation, palette.OVERLAY);
});
var MenuListItemHeader = styled.div(templateObject_15 || (templateObject_15 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size, palette = themes.palette;
    return css(templateObject_14 || (templateObject_14 = __makeTemplateObject(["\n      padding: ", " ", ";\n      color: ", ";\n      font-size: ", "\n      line-height: 1.6;\n      white-space: nowrap;\n    "], ["\n      padding: ", " ", ";\n      color: ", ";\n      font-size: ", "\n      line-height: 1.6;\n      white-space: nowrap;\n    "])), size.pxToRem(3), size.pxToRem(20), palette.TEXT_GREY, size.pxToRem(size.font.SHORT));
});
var MenuListItemDivider = styled.div(templateObject_17 || (templateObject_17 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size, frame = themes.frame;
    return css(templateObject_16 || (templateObject_16 = __makeTemplateObject(["\n      padding: 0;\n      margin: ", " 0;\n      border-top: ", ";\n    "], ["\n      padding: 0;\n      margin: ", " 0;\n      border-top: ", ";\n    "])), size.pxToRem(10), frame.border.default);
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17;
//# sourceMappingURL=HeaderUserDropdown.js.map