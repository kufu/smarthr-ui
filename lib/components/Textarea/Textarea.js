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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Textarea = void 0;
var react_1 = __importStar(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var useTheme_1 = require("../../hooks/useTheme");
var getStringLength = function (value) {
    var formattedValue = typeof value === 'number' || typeof value === 'string'
        ? "" + value
        : Array.isArray(value)
            ? value.join(',')
            : '';
    // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt
    var surrogatePairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
    return formattedValue.length - (formattedValue.match(surrogatePairs) || []).length;
};
exports.Textarea = function (_a) {
    var autoFocus = _a.autoFocus, maxLength = _a.maxLength, props = __rest(_a, ["autoFocus", "maxLength"]);
    var theme = useTheme_1.useTheme();
    var ref = react_1.useRef(null);
    var currentValue = props.defaultValue || props.value;
    var _b = react_1.useState(currentValue ? getStringLength(currentValue) : 0), count = _b[0], setCount = _b[1];
    react_1.useEffect(function () {
        if (autoFocus && ref && ref.current) {
            ref.current.focus();
        }
    }, [autoFocus]);
    var handleKeyup = function (event) {
        setCount(getStringLength(event.currentTarget.value));
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(StyledTextarea, __assign({}, (maxLength ? { onKeyUp: handleKeyup } : {}), props, { ref: ref, themes: theme })),
        maxLength && (react_1.default.createElement(Counter, { themes: theme },
            "\u3042\u3068",
            react_1.default.createElement("span", { className: maxLength && maxLength - count <= 0 ? 'error' : '' }, maxLength - count),
            "\u6587\u5B57"))));
};
var StyledTextarea = styled_components_1.default.textarea(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (props) {
    var themes = props.themes, _a = props.width, width = _a === void 0 ? 'auto' : _a, error = props.error;
    var size = themes.size, frame = themes.frame, palette = themes.palette;
    return styled_components_1.css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      padding: ", ";\n      font-size: ", ";\n      color: ", ";\n      border-radius: ", ";\n      ", "\n      background-color: #fff;\n      outline: none;\n      border: ", ";\n      ", "\n\n      &[disabled] {\n        background-color: ", ";\n        pointer-events: none;\n        color: ", ";\n      }\n    "], ["\n      padding: ", ";\n      font-size: ", ";\n      color: ", ";\n      border-radius: ", ";\n      ",
        "\n      background-color: #fff;\n      outline: none;\n      border: ", ";\n      ",
        "\n\n      &[disabled] {\n        background-color: ", ";\n        pointer-events: none;\n        color: ", ";\n      }\n    "])), size.pxToRem(size.space.XXS), size.pxToRem(size.font.TALL), palette.TEXT_BLACK, frame.border.radius.m, width && styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n        width: ", ";\n      "], ["\n        width: ", ";\n      "])), typeof width === 'number' ? width + "px" : width), frame.border.default, error
        ? styled_components_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n            border-color: ", ";\n          "], ["\n            border-color: ", ";\n          "])), palette.DANGER) : styled_components_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n            &:focus {\n              border-color: ", ";\n            }\n          "], ["\n            &:focus {\n              border-color: ", ";\n            }\n          "])), palette.hoverColor(palette.MAIN)), palette.COLUMN, palette.TEXT_DISABLED);
});
var Counter = styled_components_1.default.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var palette = themes.palette, size = themes.size;
    return styled_components_1.css(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n      font-size: ", ";\n      > span {\n        font-weight: bold;\n        color: ", ";\n        &.error {\n          color: ", ";\n        }\n      }\n    "], ["\n      font-size: ", ";\n      > span {\n        font-weight: bold;\n        color: ", ";\n        &.error {\n          color: ", ";\n        }\n      }\n    "])), size.pxToRem(size.font.SHORT), palette.TEXT_GREY, palette.DANGER);
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=Textarea.js.map