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
exports.HeaderCrewDropdown = void 0;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var useTheme_1 = require("../../hooks/useTheme");
var Dropdown_1 = require("../Dropdown");
var Icon_1 = require("../Icon");
exports.HeaderCrewDropdown = function (_a) {
    var onClickNew = _a.onClickNew, onClickBulkInsert = _a.onClickBulkInsert, onClickBulkUpdate = _a.onClickBulkUpdate, onClickInvite = _a.onClickInvite;
    var theme = useTheme_1.useTheme();
    return (react_1.default.createElement(Dropdown_1.Dropdown, null,
        react_1.default.createElement(Dropdown_1.DropdownTrigger, null,
            react_1.default.createElement(TriggerButton, { themes: theme },
                react_1.default.createElement(TriggerIcon, { themes: theme, role: "presentation" },
                    react_1.default.createElement(Icon_1.Icon, { name: "fa-users" })),
                "\u5F93\u696D\u54E1\u7BA1\u7406",
                react_1.default.createElement(CaretIcon, { themes: theme, role: "presentation" },
                    react_1.default.createElement(Icon_1.Icon, { name: "fa-caret-down", color: "#fff" })))),
        react_1.default.createElement(Dropdown_1.DropdownContent, null,
            react_1.default.createElement(MenuList, { themes: theme, role: "menu" },
                react_1.default.createElement(MenuListItem, { role: "menuitem" },
                    react_1.default.createElement(MenuListItemButton, { themes: theme, onClick: onClickNew },
                        react_1.default.createElement(MenuListItemIcon, { themes: theme },
                            react_1.default.createElement(Icon_1.Icon, { name: "fa-edit" })),
                        "\u65B0\u898F\u767B\u9332\u3059\u308B\uFF08\u624B\u5165\u529B\uFF09")),
                react_1.default.createElement(MenuListItem, { role: "menuitem" },
                    react_1.default.createElement(MenuListItemButton, { themes: theme, onClick: onClickBulkInsert },
                        react_1.default.createElement(MenuListItemIcon, { themes: theme },
                            react_1.default.createElement(Icon_1.Icon, { name: "fa-plus-square" })),
                        "\u65B0\u898F\u767B\u9332\u3059\u308B\uFF08\u30D5\u30A1\u30A4\u30EB\uFF09")),
                react_1.default.createElement(MenuListItem, { role: "menuitem" },
                    react_1.default.createElement(MenuListItemButton, { themes: theme, onClick: onClickBulkUpdate },
                        react_1.default.createElement(MenuListItemIcon, { themes: theme },
                            react_1.default.createElement(Icon_1.Icon, { name: "fa-sync-alt" })),
                        "\u66F4\u65B0\u3059\u308B\uFF08\u30D5\u30A1\u30A4\u30EB\uFF09")),
                react_1.default.createElement(MenuListItem, { role: "menuitem" },
                    react_1.default.createElement(MenuListItemDivider, { themes: theme, role: "separator" })),
                react_1.default.createElement(MenuListItem, { role: "menuitem" },
                    react_1.default.createElement(MenuListItemButton, { themes: theme, onClick: onClickInvite },
                        react_1.default.createElement(MenuListItemIcon, { themes: theme },
                            react_1.default.createElement(Icon_1.Icon, { name: "fa-paper-plane" })),
                        "SmartHR \u306B\u62DB\u5F85"))))));
};
var TriggerButton = styled_components_1.default.button(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size, interaction = themes.interaction;
    return styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      display: flex;\n      align-items: center;\n      height: 50px;\n      margin: 0;\n      padding: 0 ", ";\n      border: none;\n      background: none;\n      color: #fff;\n      font-size: ", ";\n      transition: background-color ", ";\n      cursor: pointer;\n\n      &:hover {\n        background-color: rgba(255, 255, 255, 0.3);\n      }\n    "], ["\n      display: flex;\n      align-items: center;\n      height: 50px;\n      margin: 0;\n      padding: 0 ", ";\n      border: none;\n      background: none;\n      color: #fff;\n      font-size: ", ";\n      transition: background-color ", ";\n      cursor: pointer;\n\n      &:hover {\n        background-color: rgba(255, 255, 255, 0.3);\n      }\n    "])), size.pxToRem(10), size.pxToRem(size.font.TALL), interaction.hover.animation);
});
var TriggerIcon = styled_components_1.default.figure(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size;
    return styled_components_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      display: inline-block;\n      height: 14px;\n      padding: 0;\n      margin: 0 ", " 0 0;\n      vertical-align: middle;\n    "], ["\n      display: inline-block;\n      height: 14px;\n      padding: 0;\n      margin: 0 ", " 0 0;\n      vertical-align: middle;\n    "])), size.pxToRem(size.space.XXS));
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
var MenuListItemDivider = styled_components_1.default.div(templateObject_15 || (templateObject_15 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size, frame = themes.frame;
    return styled_components_1.css(templateObject_14 || (templateObject_14 = __makeTemplateObject(["\n      padding: 0;\n      margin: ", " 0;\n      border-top: ", ";\n    "], ["\n      padding: 0;\n      margin: ", " 0;\n      border-top: ", ";\n    "])), size.pxToRem(10), frame.border.default);
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15;
//# sourceMappingURL=HeaderCrewDropdown.js.map