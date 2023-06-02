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
exports.DefinitionListItem = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const Layout_1 = require("../Layout");
const Text_1 = require("../Text");
const useClassNames_1 = require("./useClassNames");
const DefinitionListItem = ({ term, description, className = '', }) => {
    const theme = (0, useTheme_1.useTheme)();
    const { definitionListItem } = (0, useClassNames_1.useClassNames)();
    return (react_1.default.createElement(Wrapper, { themes: theme, className: `${className} ${definitionListItem.wrapper}` },
        react_1.default.createElement(Term, { className: definitionListItem.term }, term),
        react_1.default.createElement(Description, { themes: theme, className: definitionListItem.description }, description)));
};
exports.DefinitionListItem = DefinitionListItem;
const Wrapper = (0, styled_components_1.default)(Layout_1.Stack).attrs({ gap: 0.25 }) `
  ${({ themes: { border } }) => (0, styled_components_1.css) `
    border-bottom: ${border.shorthand};
    border-bottom-style: dotted;

    @media (prefers-contrast: more) {
      & {
        border-bottom: ${border.highContrast};
      }
    }
  `}
`;
const Term = (0, styled_components_1.default)(Text_1.Text).attrs({
    forwardedAs: 'dt',
    size: 'S',
    weight: 'bold',
    color: 'TEXT_GREY',
    leading: 'TIGHT',
}) ``;
const Description = (0, styled_components_1.default)(Text_1.Text).attrs({
    forwardedAs: 'dd',
    size: 'M',
    color: 'TEXT_BLACK',
    leading: 'NORMAL',
}) `
  ${({ themes: { leading, space } }) => (0, styled_components_1.css) `
    margin-inline-start: initial;
    padding-bottom: ${space(0.25)};
    min-height: ${leading.NORMAL}em;
  `}
`;
//# sourceMappingURL=DefinitionListItem.js.map