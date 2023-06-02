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
exports.RightFixedNoteItem = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const Base_1 = require("../Base");
const Button_1 = require("../Button");
const Icon_1 = require("../Icon");
const useClassNames_1 = require("./useClassNames");
const RightFixedNoteItem = ({ id, text, date, author, onClickEdit, editLabel = '編集', className = '', }) => {
    const theme = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useClassNames)();
    return (react_1.default.createElement(Wrapper, { themes: theme, className: `${className} ${classNames.item}` },
        react_1.default.createElement(TextBase, { themes: theme },
            react_1.default.createElement(EditButton, { size: "s", onClick: (e) => onClickEdit(e, id), square: true, "aria-label": editLabel, className: classNames.itemEditButton },
                react_1.default.createElement(Icon_1.FaPenIcon, null)),
            react_1.default.createElement(Text, { themes: theme, className: classNames.itemText }, text)),
        date && (react_1.default.createElement(Info, { themes: theme, className: classNames.itemDate }, date)),
        author && (react_1.default.createElement(Info, { themes: theme, className: classNames.itemAuthor }, author))));
};
exports.RightFixedNoteItem = RightFixedNoteItem;
const Wrapper = styled_components_1.default.div `
  ${({ themes: { spacingByChar } }) => {
    return (0, styled_components_1.css) `
      margin-bottom: ${spacingByChar(1.5)};
    `;
}}
`;
const TextBase = (0, styled_components_1.default)(Base_1.Base) `
  ${({ themes: { spacingByChar } }) => {
    return (0, styled_components_1.css) `
      padding: ${spacingByChar(0.5)};
      margin-bottom: ${spacingByChar(0.5)};
      overflow: hidden;
    `;
}}
`;
const Text = styled_components_1.default.p `
  ${({ themes: { fontSize } }) => {
    return (0, styled_components_1.css) `
      display: block;
      padding: 0;
      margin: 0;
      font-size: ${fontSize.M};
      line-height: 1.5;
    `;
}}
`;
const EditButton = (0, styled_components_1.default)(Button_1.Button) `
  float: right;
`;
const Info = styled_components_1.default.div `
  ${({ themes: { fontSize, color } }) => {
    return (0, styled_components_1.css) `
      color: ${color.TEXT_GREY};
      font-size: ${fontSize.S};
      text-align: right;
    `;
}}
`;
//# sourceMappingURL=RightFixedNoteItem.js.map