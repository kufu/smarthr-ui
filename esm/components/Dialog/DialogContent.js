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
import React, { createContext, useContext } from 'react';
import { DialogContext } from './DialogWrapper';
import { DialogContentInner } from './DialogContentInner';
export var DialogContentContext = createContext({
    onClickClose: function () {
        /* noop */
    },
});
export var DialogContent = function (_a) {
    var children = _a.children, props = __rest(_a, ["children"]);
    var _b = useContext(DialogContext), DialogContentRoot = _b.DialogContentRoot, onClickClose = _b.onClickClose, active = _b.active;
    return (React.createElement(DialogContentRoot, null,
        React.createElement(DialogContentContext.Provider, { value: { onClickClose: onClickClose } },
            React.createElement(DialogContentInner, __assign({ isOpen: active, onClickOverlay: onClickClose, onPressEscape: onClickClose }, props), children))));
};
//# sourceMappingURL=DialogContent.js.map