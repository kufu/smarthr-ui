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
exports.Pagination = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const lodash_1 = require("../../libs/lodash");
const Layout_1 = require("../Layout");
const PaginationControllerItem_1 = require("./PaginationControllerItem");
const PaginationItem_1 = require("./PaginationItem");
const useClassNames_1 = require("./useClassNames");
const Pagination = ({ total, current, onClick, padding = 4, className = '', withoutNumbers = false, ...props }) => {
    const theme = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useClassNames)();
    if (total <= 1)
        return null;
    const prevPage = (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("li", { className: classNames.first },
            react_1.default.createElement(PaginationControllerItem_1.PaginationControllerItem, { onClick: onClick, direction: "prev", targetPage: 1, disabled: current === 1, double: true })),
        react_1.default.createElement("li", { className: classNames.prev },
            react_1.default.createElement(PaginationControllerItem_1.PaginationControllerItem, { onClick: onClick, direction: "prev", targetPage: current - 1, disabled: current === 1 }))));
    const pages = !withoutNumbers
        ? [
            ...(0, lodash_1.range)(current - padding, current).filter((page) => page >= 1),
            ...(0, lodash_1.range)(current, current + padding + 1).filter((page) => page <= total),
        ].map((page) => (react_1.default.createElement("li", { key: `pagination-${page}`, className: page === current ? classNames.current : classNames.page },
            react_1.default.createElement(PaginationItem_1.PaginationItem, { page: page, currentPage: current, onClick: onClick }))))
        : null;
    const nextPage = (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("li", { className: classNames.next },
            react_1.default.createElement(PaginationControllerItem_1.PaginationControllerItem, { onClick: onClick, direction: "next", targetPage: current + 1, disabled: current === total })),
        react_1.default.createElement("li", { className: classNames.last },
            react_1.default.createElement(PaginationControllerItem_1.PaginationControllerItem, { onClick: onClick, direction: "next", targetPage: total, disabled: current === total, double: true }))));
    return (react_1.default.createElement(Wrapper, { ...props, className: `${className} ${classNames.wrapper}`, "aria-label": "\u30DA\u30FC\u30B8\u30CD\u30FC\u30B7\u30E7\u30F3" },
        react_1.default.createElement(Layout_1.Reel, null,
            react_1.default.createElement(List, { className: withoutNumbers ? 'withoutNumbers' : '', themes: theme },
                prevPage,
                pages,
                nextPage))));
};
exports.Pagination = Pagination;
const Wrapper = styled_components_1.default.nav `
  display: inline-block;
  max-width: 100%;
`;
const List = styled_components_1.default.ul `
  ${({ themes: { spacingByChar, shadow } }) => {
    const classNames = (0, useClassNames_1.useClassNames)();
    return (0, styled_components_1.css) `
      display: flex;
      align-items: center;
      margin: ${shadow.OUTLINE_MARGIN};
      padding: 0;
      > li {
        list-style: none;
        :not(:first-child) {
          margin-left: ${spacingByChar(0.5)};
        }
      }
      &:not(.withoutNumbers) {
        > li {
          &.${classNames.prev} + li {
            margin-left: ${spacingByChar(1)};
          }
          &.${classNames.next} {
            margin-left: ${spacingByChar(1)};
          }
        }
      }
      &.withoutNumbers {
        > li {
          &.${classNames.prev} {
            margin-left: ${spacingByChar(1)};
          }
          &.${classNames.last} {
            margin-left: ${spacingByChar(1)};
          }
        }
      }
    `;
}}
`;
//# sourceMappingURL=Pagination.js.map