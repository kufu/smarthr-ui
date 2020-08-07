var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React, { useCallback, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { SecondaryButton } from '../Button';
import { Icon } from '../Icon';
var overrideEventDefault = function (e) {
    e.preventDefault();
    e.stopPropagation();
};
export var DropZone = function (_a) {
    var children = _a.children, onSelectFiles = _a.onSelectFiles, _b = _a.accept, accept = _b === void 0 ? '' : _b;
    var theme = useTheme();
    var fileRef = useRef(null);
    var _c = useState(false), filesDraggedOver = _c[0], setFilesDraggedOver = _c[1];
    var onDrop = useCallback(function (e) {
        overrideEventDefault(e);
        setFilesDraggedOver(false);
        onSelectFiles(e, e.dataTransfer.files);
    }, [setFilesDraggedOver, onSelectFiles]);
    var onDragOver = useCallback(function (e) {
        overrideEventDefault(e);
        setFilesDraggedOver(true);
    }, [setFilesDraggedOver]);
    var onDragLeave = useCallback(function () {
        setFilesDraggedOver(false);
    }, [setFilesDraggedOver]);
    var onChange = useCallback(function (e) {
        onSelectFiles(e, e.target.files);
    }, [onSelectFiles]);
    var onClickButton = function () {
        fileRef.current.click();
    };
    return (React.createElement(Wrapper, { theme: theme, filesDraggedOver: filesDraggedOver, onDrop: onDrop, onDragOver: onDragOver, onDragLeave: onDragLeave },
        children,
        React.createElement(SecondaryButton, { prefix: React.createElement(Icon, { size: 14, name: "fa-folder-open" }), onClick: onClickButton }, "\u30D5\u30A1\u30A4\u30EB\u3092\u9078\u629E"),
        React.createElement("input", { ref: fileRef, type: "file", multiple: true, accept: accept, onChange: onChange })));
};
var Wrapper = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var theme = _a.theme, filesDraggedOver = _a.filesDraggedOver;
    var palette = theme.palette, frame = theme.frame, size = theme.size;
    var border = filesDraggedOver
        ? "solid " + frame.border.lineWidth + " " + palette.MAIN
        : "dashed " + frame.border.lineWidth + " " + palette.BORDER;
    return css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      display: flex;\n      flex-direction: column;\n      justify-content: center;\n      align-items: center;\n      padding: ", ";\n      border: ", ";\n      background-color: ", ";\n      > input {\n        display: none;\n      }\n    "], ["\n      display: flex;\n      flex-direction: column;\n      justify-content: center;\n      align-items: center;\n      padding: ", ";\n      border: ", ";\n      background-color: ", ";\n      > input {\n        display: none;\n      }\n    "])), size.pxToRem(size.space.L), border, palette.COLUMN);
});
var templateObject_1, templateObject_2;
//# sourceMappingURL=DropZone.js.map