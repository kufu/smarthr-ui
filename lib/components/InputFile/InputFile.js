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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputFile = void 0;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var ua_1 = require("../../libs/ua");
var Button_1 = require("../Button");
var Icon_1 = require("../Icon");
var useTheme_1 = require("../../hooks/useTheme");
exports.InputFile = function (_a) {
    var id = _a.id, className = _a.className, _b = _a.size, size = _b === void 0 ? 'default' : _b, label = _a.label, _c = _a.files, files = _c === void 0 ? [] : _c, _d = _a.hasFileList, hasFileList = _d === void 0 ? true : _d, onAdd = _a.onAdd, onDelete = _a.onDelete, _e = _a.disabled, disabled = _e === void 0 ? false : _e, props = __rest(_a, ["id", "className", "size", "label", "files", "hasFileList", "onAdd", "onDelete", "disabled"]);
    var theme = useTheme_1.useTheme();
    var FileButtonWrapperClassName = "" + (disabled ? 'disabled' : '');
    var FileButtonClassName = "" + size;
    var handleChange = function (e) {
        var _a;
        if (onAdd && e.target.files && ((_a = e.target.files) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            var uploadFile = Array.from(e.target.files);
            onAdd(uploadFile);
            var target = e.target;
            target.value = '';
        }
    };
    var handleDelete = function (index) {
        onDelete && onDelete(index);
    };
    return (react_1.default.createElement(Wrapper, { className: className },
        !disabled && hasFileList && files.length > 0 && (react_1.default.createElement(FileList, { themes: theme }, files.map(function (file, index) {
            return (react_1.default.createElement("li", { key: index },
                react_1.default.createElement("span", null, file.name),
                react_1.default.createElement("span", null,
                    react_1.default.createElement(Button_1.TextButton, { prefix: react_1.default.createElement(Icon_1.Icon, { size: 14, name: "fa-trash-alt" }), onClick: function () { return handleDelete(index); } }, "\u524A\u9664"))));
        }))),
        react_1.default.createElement(FileButtonWrapper, { themes: theme, className: FileButtonWrapperClassName },
            react_1.default.createElement("input", __assign({ type: "file", id: id, onChange: function (e) { return handleChange(e); }, disabled: disabled }, props)),
            react_1.default.createElement(FileButton, { themes: theme, className: FileButtonClassName, disabled: disabled },
                react_1.default.createElement("label", { htmlFor: id },
                    react_1.default.createElement(Prefix, { themes: theme },
                        react_1.default.createElement(Icon_1.Icon, { size: 14, name: "fa-folder-open" })),
                    label)))));
};
var Wrapper = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: block;\n"], ["\n  display: block;\n"])));
var FileList = styled_components_1.default.ul(function (_a) {
    var themes = _a.themes;
    var palette = themes.palette, size = themes.size;
    return styled_components_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    font-size: ", ";\n    padding: ", " ", ";\n    margin-bottom: ", ";\n    background-color: ", ";\n    list-style: none;\n\n    > li {\n      display: flex;\n      align-items: center;\n    }\n  "], ["\n    font-size: ", ";\n    padding: ", " ", ";\n    margin-bottom: ", ";\n    background-color: ", ";\n    list-style: none;\n\n    > li {\n      display: flex;\n      align-items: center;\n    }\n  "])), size.pxToRem(size.font.TALL), size.pxToRem(size.space.XXS), size.pxToRem(size.space.XS), size.pxToRem(size.space.XS), palette.COLUMN);
});
var FileButtonWrapper = styled_components_1.default.div(function (_a) {
    var themes = _a.themes;
    var palette = themes.palette, interaction = themes.interaction;
    return styled_components_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    position: relative;\n    overflow: hidden;\n    display: inline-block;\n\n    > input[type='file'] {\n      position: absolute;\n      height: 100%;\n      left: 0;\n      top: 0;\n      margin: 0;\n      font-size: 128px;\n      opacity: 0;\n\n      &::-webkit-file-upload-button {\n        cursor: pointer;\n      }\n    }\n\n    > button {\n      transition: ", ";\n    }\n\n    &:hover {\n      > button {\n        background-color: ", ";\n      }\n      &.disabled {\n        > button {\n          background-color: ", ";\n        }\n      }\n    }\n\n    &.disabled {\n      > input[type='file'] {\n        display: none;\n      }\n    }\n  "], ["\n    position: relative;\n    overflow: hidden;\n    display: inline-block;\n\n    > input[type='file'] {\n      position: absolute;\n      height: 100%;\n      left: 0;\n      top: 0;\n      margin: 0;\n      font-size: 128px;\n      opacity: 0;\n\n      &::-webkit-file-upload-button {\n        cursor: pointer;\n      }\n    }\n\n    > button {\n      transition: ", ";\n    }\n\n    &:hover {\n      > button {\n        background-color: ", ";\n      }\n      &.disabled {\n        > button {\n          background-color: ", ";\n        }\n      }\n    }\n\n    &.disabled {\n      > input[type='file'] {\n        display: none;\n      }\n    }\n  "])), ua_1.isTouchDevice ? 'none' : "all " + interaction.hover.animation, palette.hoverColor('#fff'), palette.COLUMN);
});
var FileButton = styled_components_1.default.button(function (_a) {
    var themes = _a.themes;
    var frame = themes.frame, palette = themes.palette, size = themes.size;
    return styled_components_1.css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    font-family: inherit;\n    font-weight: bold;\n    border-radius: ", ";\n    color: ", ";\n    background-color: #fff;\n    border: ", ";\n\n    > label {\n      display: flex;\n      align-items: center;\n    }\n\n    &.default {\n      font-size: ", ";\n      height: 40px;\n      padding: 0 ", ";\n    }\n\n    &.s {\n      font-size: ", ";\n      height: 27px;\n      padding: 0 ", ";\n    }\n\n    &.square {\n      width: 40px;\n      padding: 0;\n\n      &.s {\n        width: 27px;\n        min-width: 27px;\n      }\n    }\n\n    &.prefix {\n      justify-content: left;\n    }\n\n    &[disabled] {\n      cursor: not-allowed;\n      background-color: ", ";\n      color: ", ";\n      > label {\n        cursor: not-allowed;\n      }\n    }\n  "], ["\n    font-family: inherit;\n    font-weight: bold;\n    border-radius: ", ";\n    color: ", ";\n    background-color: #fff;\n    border: ", ";\n\n    > label {\n      display: flex;\n      align-items: center;\n    }\n\n    &.default {\n      font-size: ", ";\n      height: 40px;\n      padding: 0 ", ";\n    }\n\n    &.s {\n      font-size: ", ";\n      height: 27px;\n      padding: 0 ", ";\n    }\n\n    &.square {\n      width: 40px;\n      padding: 0;\n\n      &.s {\n        width: 27px;\n        min-width: 27px;\n      }\n    }\n\n    &.prefix {\n      justify-content: left;\n    }\n\n    &[disabled] {\n      cursor: not-allowed;\n      background-color: ", ";\n      color: ", ";\n      > label {\n        cursor: not-allowed;\n      }\n    }\n  "])), frame.border.radius.m, palette.TEXT_BLACK, frame.border.default, size.pxToRem(size.font.TALL), size.pxToRem(size.space.XS), size.pxToRem(size.font.SHORT), size.pxToRem(size.space.XXS), palette.COLUMN, palette.TEXT_DISABLED);
});
var Prefix = styled_components_1.default.span(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space;
    return styled_components_1.css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n      display: inline-flex;\n      margin-right: ", ";\n    "], ["\n      display: inline-flex;\n      margin-right: ", ";\n    "])), pxToRem(space.XXS));
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=InputFile.js.map