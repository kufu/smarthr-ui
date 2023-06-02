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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RightFixedNote = void 0;
const react_1 = __importStar(require("react"));
const react_innertext_1 = __importDefault(require("react-innertext"));
const styled_components_1 = __importStar(require("styled-components"));
const useId_1 = require("../../hooks/useId");
const useTheme_1 = require("../../hooks/useTheme");
const Button_1 = require("../Button");
const Heading_1 = require("../Heading");
const Textarea_1 = require("../Textarea");
const RightFixedNoteItem_1 = require("./RightFixedNoteItem");
const useClassNames_1 = require("./useClassNames");
const TEXT_AREA_NAME = 'admin_memo_new_text';
const SUBMIT_LABEL = '送信';
const RightFixedNote = ({ title, items, width = 270, textareaLabel, onClickEdit, onSubmit, className = '', decorators, ...props }) => {
    const theme = (0, useTheme_1.useTheme)();
    const submitLabel = (0, react_1.useMemo)(() => decorators?.submitLabel?.(SUBMIT_LABEL) || SUBMIT_LABEL, [decorators]);
    const handleSubmit = (0, react_1.useCallback)((e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newText = (formData.get(TEXT_AREA_NAME) || '');
        onSubmit(e, newText);
    }, [onSubmit]);
    const textareaId = (0, useId_1.useId)();
    const classNames = (0, useClassNames_1.useClassNames)();
    return (react_1.default.createElement(Wrapper, { ...props, themes: theme, "$width": width, onSubmit: handleSubmit, className: `${className} ${classNames.wrapper}` },
        react_1.default.createElement(Title, { type: "sectionTitle", themes: theme, className: classNames.title }, title),
        items &&
            items.map((item) => (react_1.default.createElement(RightFixedNoteItem_1.RightFixedNoteItem, { ...item, key: item.id, onClickEdit: onClickEdit }))),
        textareaLabel && (react_1.default.createElement("label", { htmlFor: textareaId },
            react_1.default.createElement(TextareaLabel, { tag: "span", type: "subBlockTitle", themes: theme }, textareaLabel))),
        react_1.default.createElement(StyledTextarea, { id: textareaId, name: TEXT_AREA_NAME, themes: theme, "aria-label": (0, react_innertext_1.default)(textareaLabel || title), className: classNames.textarea }),
        react_1.default.createElement(SubmitButton, { type: "submit", className: classNames.submitButton }, submitLabel)));
};
exports.RightFixedNote = RightFixedNote;
const Wrapper = styled_components_1.default.form `
  ${({ themes, $width }) => {
    const { spacingByChar, color, shadow } = themes;
    return (0, styled_components_1.css) `
      width: ${$width}px;
      padding: ${spacingByChar(1)};
      background-color: ${color.COLUMN};
      box-shadow: ${shadow.LAYER2};
      overflow: hidden scroll;
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
    `;
}}
`;
const Title = (0, styled_components_1.default)(Heading_1.Heading) `
  ${({ themes: { spacingByChar } }) => {
    return (0, styled_components_1.css) `
      display: block;
      margin-bottom: ${spacingByChar(1)};
    `;
}}
`;
const TextareaLabel = (0, styled_components_1.default)(Heading_1.Heading) `
  display: inline-block;
  margin-bottom: ${({ themes }) => themes.spacingByChar(1)};
`;
const StyledTextarea = (0, styled_components_1.default)(Textarea_1.Textarea) `
  ${({ themes: { spacingByChar } }) => {
    return (0, styled_components_1.css) `
      display: block;
      width: 100%;
      max-width: 100%;
      min-width: 100%;
      box-sizing: border-box;
      margin-bottom: ${spacingByChar(1)};
    `;
}}
`;
const SubmitButton = (0, styled_components_1.default)(Button_1.Button) `
  display: block;
  float: right;
`;
//# sourceMappingURL=RightFixedNote.js.map