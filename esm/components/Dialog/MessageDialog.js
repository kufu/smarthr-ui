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
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { DialogContentInner } from './DialogContentInner';
import { MessageDialogContentInner } from './MessageDialogContentInner';
export var MessageDialog = function (_a) {
    var isOpen = _a.isOpen, title = _a.title, description = _a.description, closeText = _a.closeText, onClickClose = _a.onClickClose, _b = _a.onClickOverlay, onClickOverlay = _b === void 0 ? function () {
        /* noop */
    } : _b, _c = _a.onPressEscape, onPressEscape = _c === void 0 ? function () {
        /* noop */
    } : _c, props = __rest(_a, ["isOpen", "title", "description", "closeText", "onClickClose", "onClickOverlay", "onPressEscape"]);
    var element = useRef(document.createElement('div')).current;
    useEffect(function () {
        document.body.appendChild(element);
        return function () {
            document.body.removeChild(element);
        };
    }, [element]);
    return createPortal(React.createElement(DialogContentInner, __assign({ onClickOverlay: onClickOverlay, onPressEscape: onPressEscape, isOpen: isOpen }, props),
        React.createElement(MessageDialogContentInner, { title: title, description: description, closeText: closeText, onClickClose: onClickClose })), element);
};
//# sourceMappingURL=MessageDialog.js.map