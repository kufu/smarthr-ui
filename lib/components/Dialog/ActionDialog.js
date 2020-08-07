"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionDialog = void 0;
var react_1 = __importStar(require("react"));
var react_dom_1 = require("react-dom");
var DialogContentInner_1 = require("./DialogContentInner");
var ActionDialogContentInner_1 = require("./ActionDialogContentInner");
exports.ActionDialog = function (_a) {
    var isOpen = _a.isOpen, children = _a.children, title = _a.title, closeText = _a.closeText, actionText = _a.actionText, actionTheme = _a.actionTheme, onClickAction = _a.onClickAction, onClickClose = _a.onClickClose, _b = _a.actionDisabled, actionDisabled = _b === void 0 ? false : _b, _c = _a.onClickOverlay, onClickOverlay = _c === void 0 ? function () {
        /* noop */
    } : _c, _d = _a.onPressEscape, onPressEscape = _d === void 0 ? function () {
        /* noop */
    } : _d, props = __rest(_a, ["isOpen", "children", "title", "closeText", "actionText", "actionTheme", "onClickAction", "onClickClose", "actionDisabled", "onClickOverlay", "onPressEscape"]);
    var element = react_1.useRef(document.createElement('div')).current;
    react_1.useEffect(function () {
        document.body.appendChild(element);
        return function () {
            document.body.removeChild(element);
        };
    }, [element]);
    return react_dom_1.createPortal(react_1.default.createElement(DialogContentInner_1.DialogContentInner, __assign({ onClickOverlay: onClickOverlay, onPressEscape: onPressEscape, isOpen: isOpen }, props),
        react_1.default.createElement(ActionDialogContentInner_1.ActionDialogContentInner, { title: title, closeText: closeText, actionText: actionText, actionTheme: actionTheme, actionDisabled: actionDisabled, onClickClose: onClickClose, onClickAction: onClickAction }, children)), element);
};
//# sourceMappingURL=ActionDialog.js.map