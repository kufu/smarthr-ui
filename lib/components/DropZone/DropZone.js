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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropZone = void 0;
var react_1 = __importStar(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var useTheme_1 = require("../../hooks/useTheme");
var Button_1 = require("../Button");
var Icon_1 = require("../Icon");
var overrideEventDefault = function (e) {
    e.preventDefault();
    e.stopPropagation();
};
exports.DropZone = function (_a) {
    var children = _a.children, onSelectFiles = _a.onSelectFiles, _b = _a.accept, accept = _b === void 0 ? '' : _b;
    var theme = useTheme_1.useTheme();
    var fileRef = react_1.useRef(null);
    var _c = react_1.useState(false), filesDraggedOver = _c[0], setFilesDraggedOver = _c[1];
    var onDrop = react_1.useCallback(function (e) {
        overrideEventDefault(e);
        setFilesDraggedOver(false);
        onSelectFiles(e, e.dataTransfer.files);
    }, [setFilesDraggedOver, onSelectFiles]);
    var onDragOver = react_1.useCallback(function (e) {
        overrideEventDefault(e);
        setFilesDraggedOver(true);
    }, [setFilesDraggedOver]);
    var onDragLeave = react_1.useCallback(function () {
        setFilesDraggedOver(false);
    }, [setFilesDraggedOver]);
    var onChange = react_1.useCallback(function (e) {
        onSelectFiles(e, e.target.files);
    }, [onSelectFiles]);
    var onClickButton = function () {
        fileRef.current.click();
    };
    return (react_1.default.createElement(Wrapper, { theme: theme, filesDraggedOver: filesDraggedOver, onDrop: onDrop, onDragOver: onDragOver, onDragLeave: onDragLeave },
        children,
        react_1.default.createElement(Button_1.SecondaryButton, { prefix: react_1.default.createElement(Icon_1.Icon, { size: 14, name: "fa-folder-open" }), onClick: onClickButton }, "\u30D5\u30A1\u30A4\u30EB\u3092\u9078\u629E"),
        react_1.default.createElement("input", { ref: fileRef, type: "file", multiple: true, accept: accept, onChange: onChange })));
};
var Wrapper = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var theme = _a.theme, filesDraggedOver = _a.filesDraggedOver;
    var palette = theme.palette, frame = theme.frame, size = theme.size;
    var border = filesDraggedOver
        ? "solid " + frame.border.lineWidth + " " + palette.MAIN
        : "dashed " + frame.border.lineWidth + " " + palette.BORDER;
    return styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      display: flex;\n      flex-direction: column;\n      justify-content: center;\n      align-items: center;\n      padding: ", ";\n      border: ", ";\n      background-color: ", ";\n      > input {\n        display: none;\n      }\n    "], ["\n      display: flex;\n      flex-direction: column;\n      justify-content: center;\n      align-items: center;\n      padding: ", ";\n      border: ", ";\n      background-color: ", ";\n      > input {\n        display: none;\n      }\n    "])), size.pxToRem(size.space.L), border, palette.COLUMN);
});
var templateObject_1, templateObject_2;
//# sourceMappingURL=DropZone.js.map