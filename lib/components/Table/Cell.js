"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cell = void 0;
var react_1 = __importStar(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var ua_1 = require("../../libs/ua");
var useTheme_1 = require("../../hooks/useTheme");
var Table_1 = require("./Table");
exports.Cell = function (_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b, children = _a.children, onClick = _a.onClick, colSpan = _a.colSpan, rowSpan = _a.rowSpan, _c = _a.highlighted, highlighted = _c === void 0 ? false : _c, _d = _a.nullable, nullable = _d === void 0 ? false : _d;
    var theme = useTheme_1.useTheme();
    var group = react_1.useContext(Table_1.TableGroupContext).group;
    var classNames = [className, highlighted && 'highlighted', nullable && 'nullable']
        .filter(function (c) { return !!c; })
        .join(' ');
    var props = {
        children: children,
        onClick: onClick,
        colSpan: colSpan,
        rowSpan: rowSpan,
        className: classNames,
        themes: theme,
    };
    if (group === 'head') {
        return react_1.default.createElement(Th, __assign({}, props));
    }
    else if (group === 'body') {
        return react_1.default.createElement(Td, __assign({}, props));
    }
    else {
        return null;
    }
};
var Th = styled_components_1.default.th(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes, onClick = _a.onClick;
    var size = themes.size, palette = themes.palette, interaction = themes.interaction;
    return styled_components_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      font-size: ", ";\n      font-weight: bold;\n      padding: ", ";\n      color: ", ";\n      transition: ", ";\n      text-align: left;\n      line-height: 1.5;\n      vertical-align: middle;\n\n      &.highlighted {\n        background-color: ", ";\n      }\n\n      ", "\n    "], ["\n      font-size: ", ";\n      font-weight: bold;\n      padding: ", ";\n      color: ", ";\n      transition: ", ";\n      text-align: left;\n      line-height: 1.5;\n      vertical-align: middle;\n\n      &.highlighted {\n        background-color: ", ";\n      }\n\n      ",
        "\n    "])), size.pxToRem(size.font.SHORT), size.pxToRem(size.space.XS), palette.TEXT_GREY, ua_1.isTouchDevice ? 'none' : "background-color " + interaction.hover.animation, palette.hoverColor(palette.COLUMN), onClick && styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n        :hover {\n          background-color: ", ";\n          cursor: pointer;\n        }\n      "], ["\n        :hover {\n          background-color: ", ";\n          cursor: pointer;\n        }\n      "])), palette.hoverColor(palette.COLUMN)));
});
var Td = styled_components_1.default.td(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  &.nullable {\n    &:empty {\n      &::after {\n        content: '-----';\n      }\n    }\n  }\n\n  ", ";\n"], ["\n  &.nullable {\n    &:empty {\n      &::after {\n        content: '-----';\n      }\n    }\n  }\n\n  ",
    ";\n"])), function (_a) {
    var themes = _a.themes;
    var size = themes.size, palette = themes.palette, frame = themes.frame;
    return styled_components_1.css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      color: ", ";\n      padding: ", ";\n      border-top: ", ";\n      font-size: ", ";\n      line-height: 1.5;\n      vertical-align: middle;\n    "], ["\n      color: ", ";\n      padding: ", ";\n      border-top: ", ";\n      font-size: ", ";\n      line-height: 1.5;\n      vertical-align: middle;\n    "])), palette.TEXT_BLACK, size.pxToRem(size.space.XS), frame.border.default, size.pxToRem(size.font.TALL));
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=Cell.js.map