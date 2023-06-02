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
exports.InputFile = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const Button_1 = require("../Button");
const Icon_1 = require("../Icon");
const useClassNames_1 = require("./useClassNames");
const DESTROY_BUTTON_TEXT = '削除';
exports.InputFile = (0, react_1.forwardRef)(({ className = '', size = 'default', label, hasFileList = true, onChange, disabled = false, error, decorators, ...props }, ref) => {
    const theme = (0, useTheme_1.useTheme)();
    const [files, setFiles] = (0, react_1.useState)([]);
    // Safari において、input.files への直接代入時に onChange が発火することを防ぐためのフラグ
    const isUpdatingFilesDirectly = (0, react_1.useRef)(false);
    const inputRef = (0, react_1.useRef)(null);
    (0, react_1.useImperativeHandle)(ref, () => inputRef.current);
    const destroyButtonText = (0, react_1.useMemo)(() => decorators?.destroy?.(DESTROY_BUTTON_TEXT) || DESTROY_BUTTON_TEXT, [decorators]);
    const inputWrapperClassName = (0, react_1.useMemo)(() => `${size === 's' ? 'small' : ''} ${disabled ? 'disabled' : ''} ${error ? 'error' : ''}`, [disabled, error, size]);
    const classNames = (0, useClassNames_1.useClassNames)();
    const updateFiles = (0, react_1.useCallback)((newFiles) => {
        onChange && onChange(newFiles);
        setFiles(newFiles);
    }, [setFiles, onChange]);
    const handleChange = (0, react_1.useCallback)((e) => {
        if (isUpdatingFilesDirectly.current) {
            return;
        }
        const newFiles = Array.from(e.target.files ?? []);
        updateFiles(newFiles);
    }, [isUpdatingFilesDirectly, updateFiles]);
    const handleDelete = (0, react_1.useCallback)((index) => {
        if (!inputRef.current) {
            return;
        }
        const newFiles = files.filter((_, i) => index !== i);
        updateFiles(newFiles);
        const buff = new DataTransfer();
        newFiles.forEach((file) => {
            buff.items.add(file);
        });
        isUpdatingFilesDirectly.current = true;
        inputRef.current.files = buff.files;
        isUpdatingFilesDirectly.current = false;
    }, [files, isUpdatingFilesDirectly, inputRef, updateFiles]);
    return (react_1.default.createElement(Wrapper, { className: `${className} ${classNames.wrapper}` },
        !disabled && hasFileList && files.length > 0 && (react_1.default.createElement(FileList, { themes: theme, className: classNames.fileList }, files.map((file, index) => {
            return (react_1.default.createElement("li", { key: `${file.name}-${index}` },
                react_1.default.createElement("span", { className: classNames.fileName }, file.name),
                react_1.default.createElement("span", null,
                    react_1.default.createElement(Button_1.Button, { variant: "text", prefix: react_1.default.createElement(Icon_1.FaTrashAltIcon, null), onClick: () => handleDelete(index), className: classNames.deleteButton }, destroyButtonText))));
        }))),
        react_1.default.createElement(InputWrapper, { className: inputWrapperClassName, themes: theme },
            react_1.default.createElement("input", { ...props, type: "file", onChange: handleChange, disabled: disabled, className: classNames.input, ref: inputRef, "aria-invalid": error || undefined }),
            react_1.default.createElement(Prefix, { themes: theme },
                react_1.default.createElement(Icon_1.FaFolderOpenIcon, null)),
            label)));
});
const Wrapper = styled_components_1.default.div `
  display: block;
`;
const FileList = styled_components_1.default.ul(({ themes }) => {
    const { fontSize, color, spacingByChar } = themes;
    return (0, styled_components_1.css) `
    font-size: ${fontSize.M};
    padding: ${spacingByChar(0.5)} ${spacingByChar(1)};
    margin-top: 0;
    margin-bottom: ${spacingByChar(1)};
    background-color: ${color.COLUMN};
    list-style: none;

    > li {
      display: flex;
      align-items: center;
    }
  `;
});
const InputWrapper = styled_components_1.default.span(({ themes }) => {
    const { border, color, fontSize, leading, radius, shadow, spacingByChar } = themes;
    return (0, styled_components_1.css) `
    background-color: ${color.WHITE};
    position: relative;
    display: inline-flex;
    font-weight: bold;
    line-height: ${leading.NONE};
    border: ${border.shorthand};
    border-radius: ${radius.m};
    padding: ${spacingByChar(0.75)} ${spacingByChar(1)};
    font-size: ${fontSize.M};

    @media (prefers-contrast: more) {
      & {
        border: ${border.highContrast};
      }
    }

    &.small {
      padding: ${spacingByChar(0.5)};
      font-size: ${fontSize.S};
    }
    &:focus-within {
      ${shadow.focusIndicatorStyles}
    }
    &.disabled {
      border-color: ${color.disableColor(color.BORDER)};
      background-color: ${color.disableColor(color.WHITE)};
      color: ${color.TEXT_DISABLED};
    }
    &:not(.disabled) {
      &:hover {
        border-color: ${color.hoverColor(color.BORDER)};
        background-color: ${color.hoverColor(color.WHITE)};
        color: ${color.TEXT_BLACK};
      }
    }
    &&.error {
      border-color: ${color.DANGER};
    }

    > input[type='file'] {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      ::file-selector-button {
        width: 100%;
        height: 100%;
        cursor: pointer;
      }
      &[disabled] {
        ::file-selector-button {
          cursor: not-allowed;
        }
      }
    }
  `;
});
const Prefix = styled_components_1.default.span `
  ${({ themes: { spacingByChar } }) => {
    return (0, styled_components_1.css) `
      display: inline-flex;
      margin-right: ${spacingByChar(0.5)};
    `;
}}
`;
//# sourceMappingURL=InputFile.js.map