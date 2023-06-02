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
exports.ItemButton = exports.PaginationItem = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const Button_1 = require("../Button");
const PaginationItem = ({ page, currentPage, onClick }) => {
    const theme = (0, useTheme_1.useTheme)();
    if (page === currentPage) {
        return (react_1.default.createElement(exports.ItemButton, { className: "active", themes: theme, "aria-current": "page", "aria-label": `${page}ページ目`, disabled: true }, page));
    }
    return (react_1.default.createElement(exports.ItemButton, { onClick: () => onClick(page), themes: theme, "aria-label": `${page}ページ目` }, page));
};
exports.PaginationItem = PaginationItem;
exports.ItemButton = (0, styled_components_1.default)(Button_1.Button).attrs({
    square: true,
    size: 's',
}) `
  ${({ themes: { color, radius } }) => (0, styled_components_1.css) `
      border-radius: ${radius.s};
      &.active {
        cursor: default;
        outline: none;
        border: 1px solid ${color.MAIN};
        background-color: ${color.MAIN};
        color: ${color.TEXT_WHITE};
      }
    `}
`;
//# sourceMappingURL=PaginationItem.js.map