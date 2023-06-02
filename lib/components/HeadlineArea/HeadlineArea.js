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
exports.HeadlineArea = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const Heading_1 = require("../Heading");
const useClassNames_1 = require("./useClassNames");
/**
 * @deprecated `HeadlineArea` は非推奨です。`Stack` で書き換えてください。
 */
const HeadlineArea = ({ heading, description, className = '', ...props }) => {
    const theme = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useClassNames)();
    return (react_1.default.createElement(Wrapper, { ...props, theme: theme, className: `${className} ${classNames.wrapper}` },
        react_1.default.createElement(Heading_1.Heading, { type: "screenTitle", tag: heading.tag ? heading.tag : 'h1' }, heading.children),
        description && (react_1.default.createElement(Description, { themes: theme, className: classNames.description }, description))));
};
exports.HeadlineArea = HeadlineArea;
const Wrapper = styled_components_1.default.div `
  display: block;
  margin: 0;
  padding: 0;
`;
const Description = styled_components_1.default.div `
  ${({ themes }) => {
    const { fontSize, spacingByChar, color } = themes;
    return (0, styled_components_1.css) `
      margin-top: ${spacingByChar(1)};
      color: ${color.TEXT_BLACK};
      font-size: ${fontSize.M};
      line-height: 1.5;
    `;
}}
`;
//# sourceMappingURL=HeadlineArea.js.map