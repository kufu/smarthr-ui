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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Header = void 0;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var useTheme_1 = require("../../hooks/useTheme");
var SmartHRLogo_1 = require("../SmartHRLogo");
var HeaderButton_1 = require("./HeaderButton");
var HeaderNotification_1 = require("./HeaderNotification");
var HeaderCrewDropdown_1 = require("./HeaderCrewDropdown");
var HeaderUserDropdown_1 = require("./HeaderUserDropdown");
exports.Header = function (_a) {
    var _b = _a.isAdmin, isAdmin = _b === void 0 ? false : _b, _c = _a.isCrew, isCrew = _c === void 0 ? false : _c, _d = _a.showHelp, showHelp = _d === void 0 ? true : _d, _e = _a.showCrewList, showCrewList = _e === void 0 ? true : _e, _f = _a.showCrewManagement, showCrewManagement = _f === void 0 ? true : _f, _g = _a.showNotification, showNotification = _g === void 0 ? true : _g, _h = _a.showLogout, showLogout = _h === void 0 ? true : _h, user = _a.user, currentTenantName = _a.currentTenantName, tenantContent = _a.tenantContent, notificationLength = _a.notificationLength, onClickLogo = _a.onClickLogo, onClickHelp = _a.onClickHelp, onClickNotification = _a.onClickNotification, onClickAccount = _a.onClickAccount, onClickLogout = _a.onClickLogout, onClickCrewList = _a.onClickCrewList, onClickNewCrew = _a.onClickNewCrew, onClickBulkInsertCrews = _a.onClickBulkInsertCrews, onClickBulkUpdateCrews = _a.onClickBulkUpdateCrews, onClickInviteCrew = _a.onClickInviteCrew, onClickProfile = _a.onClickProfile, onClickCompany = _a.onClickCompany, onClickSchool = _a.onClickSchool, className = _a.className;
    var theme = useTheme_1.useTheme();
    var displayName = user.displayName, avatar = user.avatar;
    return (react_1.default.createElement(Wrapper, { themes: theme, className: className },
        react_1.default.createElement(HeaderColumn, null,
            react_1.default.createElement(HeaderLogo, { onClick: onClickLogo, "aria-label": "SmartHR", themes: theme },
                react_1.default.createElement(SmartHRLogo_1.SmartHRLogo, null)),
            react_1.default.createElement(TenantName, { themes: theme }, tenantContent ? tenantContent : currentTenantName)),
        react_1.default.createElement(HeaderColumn, null,
            showHelp && (react_1.default.createElement(HeaderButton_1.HeaderButton, { icon: "fa-question-circle", onClick: onClickHelp }, "\u30D8\u30EB\u30D7")),
            isAdmin && (react_1.default.createElement(react_1.default.Fragment, null,
                showCrewList && (react_1.default.createElement(HeaderButton_1.HeaderButton, { icon: "fa-th-list", onClick: onClickCrewList }, "\u5F93\u696D\u54E1\u30EA\u30B9\u30C8")),
                showCrewManagement && (react_1.default.createElement(HeaderCrewDropdown_1.HeaderCrewDropdown, { onClickNew: onClickNewCrew, onClickBulkInsert: onClickBulkInsertCrews, onClickBulkUpdate: onClickBulkUpdateCrews, onClickInvite: onClickInviteCrew })))),
            showNotification && (react_1.default.createElement(HeaderNotification_1.HeaderNotification, { length: notificationLength, onClick: onClickNotification })),
            react_1.default.createElement(HeaderUserDropdown_1.HeaderUserDropdown, { isAdmin: isAdmin, isCrew: isCrew, displayName: displayName, currentTenantName: currentTenantName, avatar: avatar, showLogout: showLogout, onClickAccount: onClickAccount, onClickLogout: onClickLogout, onClickProfile: onClickProfile, onClickCompany: onClickCompany, onClickSchool: onClickSchool }))));
};
var Wrapper = styled_components_1.default.header(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size, palette = themes.palette;
    return styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      height: 50px;\n      padding: 0 ", ";\n      background-color: ", ";\n    "], ["\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      height: 50px;\n      padding: 0 ", ";\n      background-color: ", ";\n    "])), size.pxToRem(size.space.XS), palette.BRAND);
});
var HeaderColumn = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n"], ["\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n"])));
var HeaderLogo = styled_components_1.default.button(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var animation = themes.interaction.hover.animation;
    return styled_components_1.css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      padding: 0;\n      border: none;\n      background: none;\n      box-sizing: border-box;\n      transition: opacity ", ";\n      cursor: pointer;\n\n      &:hover {\n        opacity: 0.7;\n      }\n    "], ["\n      padding: 0;\n      border: none;\n      background: none;\n      box-sizing: border-box;\n      transition: opacity ", ";\n      cursor: pointer;\n\n      &:hover {\n        opacity: 0.7;\n      }\n    "])), animation);
});
var TenantName = styled_components_1.default.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size;
    return styled_components_1.css(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n      margin: 0 0 0 ", ";\n      font-size: ", ";\n      color: #fff;\n    "], ["\n      margin: 0 0 0 ", ";\n      font-size: ", ";\n      color: #fff;\n    "])), size.pxToRem(size.space.XS), size.pxToRem(size.font.TALL));
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=Header.js.map