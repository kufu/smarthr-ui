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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { useContext } from 'react';
import { DialogContext } from './DialogWrapper';
import { DialogContentInner } from './DialogContentInner';
import { ActionDialogContentInner } from './ActionDialogContentInner';
export var ActionDialogContent = function (_a) {
    var children = _a.children, title = _a.title, closeText = _a.closeText, actionText = _a.actionText, actionTheme = _a.actionTheme, onClickAction = _a.onClickAction, _b = _a.actionDisabled, actionDisabled = _b === void 0 ? false : _b, props = __rest(_a, ["children", "title", "closeText", "actionText", "actionTheme", "onClickAction", "actionDisabled"]);
    var _c = useContext(DialogContext), DialogContentRoot = _c.DialogContentRoot, onClickClose = _c.onClickClose, active = _c.active;
    return (React.createElement(DialogContentRoot, null,
        React.createElement(DialogContentInner, __assign({ onClickOverlay: onClickClose, onPressEscape: onClickClose, isOpen: active }, props),
            React.createElement(ActionDialogContentInner, { title: title, closeText: closeText, actionText: actionText, actionTheme: actionTheme, onClickAction: onClickAction, onClickClose: onClickClose, actionDisabled: actionDisabled }, children))));
};
//# sourceMappingURL=ActionDialogContent.js.map