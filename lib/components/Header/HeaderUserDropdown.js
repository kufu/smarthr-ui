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
exports.HeaderUserDropdown = void 0;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var useTheme_1 = require("../../hooks/useTheme");
var Dropdown_1 = require("../Dropdown");
var Icon_1 = require("../Icon");
exports.HeaderUserDropdown = function (_a) {
    var isAdmin = _a.isAdmin, isCrew = _a.isCrew, displayName = _a.displayName, currentTenantName = _a.currentTenantName, avatar = _a.avatar, onClickAccount = _a.onClickAccount, onClickLogout = _a.onClickLogout, onClickProfile = _a.onClickProfile, onClickCompany = _a.onClickCompany, onClickSchool = _a.onClickSchool;
    var theme = useTheme_1.useTheme();
    return (react_1.default.createElement(Dropdown_1.Dropdown, null,
        react_1.default.createElement(Dropdown_1.DropdownTrigger, null,
            react_1.default.createElement(TriggerButton, { themes: theme },
                avatar && (react_1.default.createElement(Avatar, { src: avatar, width: 20, height: 20, alt: displayName + 'の写真', themes: theme })),
                displayName,
                react_1.default.createElement(CaretIcon, { themes: theme, role: "presentation" },
                    react_1.default.createElement(Icon_1.Icon, { name: "fa-caret-down", color: "#fff" })))),
        react_1.default.createElement(Dropdown_1.DropdownContent, null,
            react_1.default.createElement(MenuList, { themes: theme, role: "menu" },
                react_1.default.createElement(MenuListItem, { role: "menuitem" },
                    react_1.default.createElement(MenuListItemHeader, { themes: theme }, displayName)),
                isCrew && (react_1.default.createElement(MenuListItem, { role: "menuitem" },
                    react_1.default.createElement(MenuListItemButton, { onClick: onClickProfile, themes: theme },
                        react_1.default.createElement(MenuListItemIcon, { themes: theme },
                            react_1.default.createElement(Icon_1.Icon, { name: "fa-user-alt" })),
                        "\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB\u306E\u78BA\u8A8D"))),
                react_1.default.createElement(MenuListItem, { role: "menuitem" },
                    react_1.default.createElement(MenuListItemButton, { onClick: onClickAccount, themes: theme },
                        react_1.default.createElement(MenuListItemIcon, { themes: theme },
                            react_1.default.createElement(Icon_1.Icon, { name: "fa-cog" })),
                        "\u500B\u4EBA\u8A2D\u5B9A")),
                isAdmin && (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(MenuListItem, { role: "menuitem" },
                        react_1.default.createElement(MenuListItemDivider, { themes: theme, role: "separator" })),
                    react_1.default.createElement(MenuListItem, { role: "menuitem" },
                        react_1.default.createElement(MenuListItemHeader, { themes: theme }, currentTenantName)),
                    react_1.default.createElement(MenuListItem, { role: "menuitem" },
                        react_1.default.createElement(MenuListItemButton, { onClick: onClickCompany, themes: theme },
                            react_1.default.createElement(MenuListItemIcon, { themes: theme },
                                react_1.default.createElement(Icon_1.Icon, { name: "fa-building" })),
                            "\u5171\u901A\u8A2D\u5B9A")))),
                react_1.default.createElement(MenuListItem, { role: "menuitem" },
                    react_1.default.createElement(MenuListItemDivider, { themes: theme, role: "separator" })),
                isAdmin && (react_1.default.createElement(MenuListItem, { role: "menuitem" },
                    react_1.default.createElement(MenuListItemButton, { onClick: onClickSchool, themes: theme },
                        react_1.default.createElement(MenuListItemIcon, { themes: theme },
                            react_1.default.createElement(Icon_1.Icon, { name: "fa-graduation-cap" })),
                        "SmartHR \u30B9\u30AF\u30FC\u30EB"))),
                react_1.default.createElement(MenuListItem, { role: "menuitem" },
                    react_1.default.createElement(MenuListItemButton, { onClick: onClickLogout, themes: theme },
                        react_1.default.createElement(MenuListItemIcon, { themes: theme },
                            react_1.default.createElement(Icon_1.Icon, { name: "fa-power-off" })),
                        "\u30ED\u30B0\u30A2\u30A6\u30C8"))))));
};
var TriggerButton = styled_components_1.default.button(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size, interaction = themes.interaction;
    return styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      display: flex;\n      align-items: center;\n      height: 50px;\n      margin: 0;\n      padding: 0 ", ";\n      border: none;\n      background: none;\n      color: #fff;\n      font-size: ", ";\n      transition: background-color ", ";\n      cursor: pointer;\n\n      &:hover {\n        background-color: rgba(255, 255, 255, 0.3);\n      }\n    "], ["\n      display: flex;\n      align-items: center;\n      height: 50px;\n      margin: 0;\n      padding: 0 ", ";\n      border: none;\n      background: none;\n      color: #fff;\n      font-size: ", ";\n      transition: background-color ", ";\n      cursor: pointer;\n\n      &:hover {\n        background-color: rgba(255, 255, 255, 0.3);\n      }\n    "])), size.pxToRem(10), size.pxToRem(size.font.TALL), interaction.hover.animation);
});
var Avatar = styled_components_1.default.img(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", ";\n"], ["\n  ",
    ";\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size;
    return styled_components_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      border-radius: 4px;\n      margin-right: ", ";\n    "], ["\n      border-radius: 4px;\n      margin-right: ", ";\n    "])), size.pxToRem(size.space.XXS));
});
var CaretIcon = styled_components_1.default.figure(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size;
    return styled_components_1.css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n      display: inline-block;\n      padding: 0;\n      margin: 0 0 0 ", ";\n      vertical-align: middle;\n    "], ["\n      display: inline-block;\n      padding: 0;\n      margin: 0 0 0 ", ";\n      vertical-align: middle;\n    "])), size.pxToRem(size.space.XXS));
});
var MenuList = styled_components_1.default.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size, frame = themes.frame;
    return styled_components_1.css(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n      border: ", ";\n      border-radius: ", ";\n      background-color: #fff;\n      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);\n      padding: ", " 0;\n    "], ["\n      border: ", ";\n      border-radius: ", ";\n      background-color: #fff;\n      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);\n      padding: ", " 0;\n    "])), frame.border.default, frame.border.radius.s, size.pxToRem(5));
});
var MenuListItem = styled_components_1.default.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  margin: 0;\n  padding: 0;\n"], ["\n  margin: 0;\n  padding: 0;\n"])));
var MenuListItemIcon = styled_components_1.default.figure(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size;
    return styled_components_1.css(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n      display: flex;\n      align-items: center;\n      padding: 0;\n      margin: 0 ", " 0 0;\n    "], ["\n      display: flex;\n      align-items: center;\n      padding: 0;\n      margin: 0 ", " 0 0;\n    "])), size.pxToRem(size.space.XXS));
});
var MenuListItemButton = styled_components_1.default.button(templateObject_13 || (templateObject_13 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size, palette = themes.palette, interaction = themes.interaction;
    return styled_components_1.css(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n      display: flex;\n      align-items: center;\n      width: 100%;\n      padding: ", " ", ";\n      border: none;\n      background: none;\n      color: ", ";\n      font-size: ", ";\n      line-height: 1.5;\n      white-space: nowrap;\n      box-sizing: border-box;\n      transition: background-color ", ";\n      cursor: pointer;\n\n      &:hover {\n        background-color: ", ";\n      }\n    "], ["\n      display: flex;\n      align-items: center;\n      width: 100%;\n      padding: ", " ", ";\n      border: none;\n      background: none;\n      color: ", ";\n      font-size: ", ";\n      line-height: 1.5;\n      white-space: nowrap;\n      box-sizing: border-box;\n      transition: background-color ", ";\n      cursor: pointer;\n\n      &:hover {\n        background-color: ", ";\n      }\n    "])), size.pxToRem(3), size.pxToRem(20), palette.TEXT_BLACK, size.pxToRem(size.font.TALL), interaction.hover.animation, palette.OVERLAY);
});
var MenuListItemHeader = styled_components_1.default.div(templateObject_15 || (templateObject_15 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size, palette = themes.palette;
    return styled_components_1.css(templateObject_14 || (templateObject_14 = __makeTemplateObject(["\n      padding: ", " ", ";\n      color: ", ";\n      font-size: ", "\n      line-height: 1.6;\n      white-space: nowrap;\n    "], ["\n      padding: ", " ", ";\n      color: ", ";\n      font-size: ", "\n      line-height: 1.6;\n      white-space: nowrap;\n    "])), size.pxToRem(3), size.pxToRem(20), palette.TEXT_GREY, size.pxToRem(size.font.SHORT));
});
var MenuListItemDivider = styled_components_1.default.div(templateObject_17 || (templateObject_17 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size, frame = themes.frame;
    return styled_components_1.css(templateObject_16 || (templateObject_16 = __makeTemplateObject(["\n      padding: 0;\n      margin: ", " 0;\n      border-top: ", ";\n    "], ["\n      padding: 0;\n      margin: ", " 0;\n      border-top: ", ";\n    "])), size.pxToRem(10), frame.border.default);
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17;
//# sourceMappingURL=HeaderUserDropdown.js.map