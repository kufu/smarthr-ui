"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropZone = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const Button_1 = require("../Button");
const Icon_1 = require("../Icon");
const useClassNames_1 = require("./useClassNames");
const SELECT_BUTTON_LABEL = 'ファイルを選択';
const overrideEventDefault = (e) => {
    e.preventDefault();
    e.stopPropagation();
};
exports.DropZone = (0, react_1.forwardRef)(({ children, onSelectFiles, accept, multiple = true, name, decorators }, ref) => {
    const theme = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useClassNames)();
    const fileRef = (0, react_1.useRef)(null);
    const [filesDraggedOver, setFilesDraggedOver] = (0, react_1.useState)(false);
    (0, react_1.useImperativeHandle)(ref, () => fileRef.current);
    const selectButtonLabel = (0, react_1.useMemo)(() => decorators?.selectButtonLabel?.(SELECT_BUTTON_LABEL) || SELECT_BUTTON_LABEL, [decorators]);
    const onDrop = (0, react_1.useCallback)((e) => {
        overrideEventDefault(e);
        setFilesDraggedOver(false);
        onSelectFiles(e, e.dataTransfer.files);
    }, [setFilesDraggedOver, onSelectFiles]);
    const onDragOver = (0, react_1.useCallback)((e) => {
        overrideEventDefault(e);
        setFilesDraggedOver(true);
    }, [setFilesDraggedOver]);
    const onDragLeave = (0, react_1.useCallback)(() => {
        setFilesDraggedOver(false);
    }, [setFilesDraggedOver]);
    const onChange = (0, react_1.useCallback)((e) => {
        onSelectFiles(e, e.target.files);
    }, [onSelectFiles]);
    const onClickButton = () => {
        fileRef.current.click();
    };
    return (react_1.default.createElement(Wrapper, { theme: theme, filesDraggedOver: filesDraggedOver, onDrop: onDrop, onDragOver: onDragOver, onDragLeave: onDragLeave, className: classNames.wrapper },
        children,
        react_1.default.createElement(Button_1.Button, { prefix: react_1.default.createElement(Icon_1.FaFolderOpenIcon, null), onClick: onClickButton }, selectButtonLabel),
        react_1.default.createElement("input", { ref: fileRef, name: name, type: "file", multiple: multiple, accept: accept, onChange: onChange })));
});
const Wrapper = styled_components_1.default.div `
  ${({ theme, filesDraggedOver }) => {
    const { palette, frame, spacingByChar } = theme;
    const border = filesDraggedOver
        ? `solid ${frame.border.lineWidth} ${palette.MAIN}`
        : `dashed ${frame.border.lineWidth} ${palette.BORDER}`;
    return (0, styled_components_1.css) `
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: ${spacingByChar(2.5)};
      border: ${border};
      background-color: ${palette.COLUMN};
      > input {
        display: none;
      }
    `;
}}
`;
//# sourceMappingURL=DropZone.js.map