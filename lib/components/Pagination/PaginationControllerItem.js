"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationControllerItem = void 0;
var react_1 = __importDefault(require("react"));
var useTheme_1 = require("../../hooks/useTheme");
var PaginationItem_1 = require("./PaginationItem");
var Icon_1 = require("../Icon");
exports.PaginationControllerItem = function (_a) {
    var direction = _a.direction, disabled = _a.disabled, double = _a.double, targetPage = _a.targetPage, onClick = _a.onClick;
    var theme = useTheme_1.useTheme();
    return (react_1.default.createElement(PaginationItem_1.ItemButton, { square: true, size: "s", className: "paginationItem", onClick: function () { return onClick(targetPage); }, disabled: disabled, themes: theme },
        react_1.default.createElement(Icon_1.Icon, { name: direction === 'prev'
                ? double
                    ? 'fa-angle-double-left'
                    : 'fa-chevron-left'
                : double
                    ? 'fa-angle-double-right'
                    : 'fa-chevron-right', color: disabled ? theme.palette.TEXT_DISABLED : theme.palette.TEXT_BLACK, size: 13 })));
};
//# sourceMappingURL=PaginationControllerItem.js.map