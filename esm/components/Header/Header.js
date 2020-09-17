var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { SmartHRLogo } from '../SmartHRLogo';
import { HeaderButton } from './HeaderButton';
import { HeaderNotification } from './HeaderNotification';
import { HeaderCrewDropdown } from './HeaderCrewDropdown';
import { HeaderUserDropdown } from './HeaderUserDropdown';
export var Header = function (_a) {
    var _b = _a.isAdmin, isAdmin = _b === void 0 ? false : _b, _c = _a.isCrew, isCrew = _c === void 0 ? false : _c, _d = _a.showHelp, showHelp = _d === void 0 ? true : _d, _e = _a.showCrewList, showCrewList = _e === void 0 ? true : _e, _f = _a.showCrewManagement, showCrewManagement = _f === void 0 ? true : _f, _g = _a.showNotification, showNotification = _g === void 0 ? true : _g, _h = _a.showLogout, showLogout = _h === void 0 ? true : _h, user = _a.user, currentTenantName = _a.currentTenantName, tenantContent = _a.tenantContent, notificationLength = _a.notificationLength, onClickLogo = _a.onClickLogo, onClickHelp = _a.onClickHelp, onClickNotification = _a.onClickNotification, onClickAccount = _a.onClickAccount, onClickLogout = _a.onClickLogout, onClickCrewList = _a.onClickCrewList, onClickNewCrew = _a.onClickNewCrew, onClickBulkInsertCrews = _a.onClickBulkInsertCrews, onClickBulkUpdateCrews = _a.onClickBulkUpdateCrews, onClickInviteCrew = _a.onClickInviteCrew, onClickProfile = _a.onClickProfile, onClickCompany = _a.onClickCompany, onClickSchool = _a.onClickSchool, className = _a.className;
    var theme = useTheme();
    var displayName = user.displayName, avatar = user.avatar;
    return (React.createElement(Wrapper, { themes: theme, className: className },
        React.createElement(HeaderColumn, null,
            React.createElement(HeaderLogo, { onClick: onClickLogo, "aria-label": "SmartHR", themes: theme },
                React.createElement(SmartHRLogo, null)),
            React.createElement(TenantName, { themes: theme }, tenantContent ? tenantContent : currentTenantName)),
        React.createElement(HeaderColumn, null,
            showHelp && (React.createElement(HeaderButton, { icon: "fa-question-circle", onClick: onClickHelp }, "\u30D8\u30EB\u30D7")),
            isAdmin && (React.createElement(React.Fragment, null,
                showCrewList && (React.createElement(HeaderButton, { icon: "fa-th-list", onClick: onClickCrewList }, "\u5F93\u696D\u54E1\u30EA\u30B9\u30C8")),
                showCrewManagement && (React.createElement(HeaderCrewDropdown, { onClickNew: onClickNewCrew, onClickBulkInsert: onClickBulkInsertCrews, onClickBulkUpdate: onClickBulkUpdateCrews, onClickInvite: onClickInviteCrew })))),
            showNotification && (React.createElement(HeaderNotification, { length: notificationLength, onClick: onClickNotification })),
            React.createElement(HeaderUserDropdown, { isAdmin: isAdmin, isCrew: isCrew, displayName: displayName, currentTenantName: currentTenantName, avatar: avatar, showLogout: showLogout, onClickAccount: onClickAccount, onClickLogout: onClickLogout, onClickProfile: onClickProfile, onClickCompany: onClickCompany, onClickSchool: onClickSchool }))));
};
var Wrapper = styled.header(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size, palette = themes.palette;
    return css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      height: 50px;\n      padding: 0 ", ";\n      background-color: ", ";\n    "], ["\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      height: 50px;\n      padding: 0 ", ";\n      background-color: ", ";\n    "])), size.pxToRem(size.space.XS), palette.BRAND);
});
var HeaderColumn = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n"], ["\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n"])));
var HeaderLogo = styled.button(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var animation = themes.interaction.hover.animation;
    return css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      padding: 0;\n      border: none;\n      background: none;\n      box-sizing: border-box;\n      transition: opacity ", ";\n      cursor: pointer;\n\n      &:hover {\n        opacity: 0.7;\n      }\n    "], ["\n      padding: 0;\n      border: none;\n      background: none;\n      box-sizing: border-box;\n      transition: opacity ", ";\n      cursor: pointer;\n\n      &:hover {\n        opacity: 0.7;\n      }\n    "])), animation);
});
var TenantName = styled.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size;
    return css(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n      margin: 0 0 0 ", ";\n      font-size: ", ";\n      color: #fff;\n    "], ["\n      margin: 0 0 0 ", ";\n      font-size: ", ";\n      color: #fff;\n    "])), size.pxToRem(size.space.XS), size.pxToRem(size.font.TALL));
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=Header.js.map