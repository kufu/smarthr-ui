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
exports.BackgroundJobsList = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const useClassNames_1 = require("./useClassNames");
const BackgroundJobsList = ({ children, className = '' }) => {
    const themes = (0, useTheme_1.useTheme)();
    const { backgroundJobsList: classNames } = (0, useClassNames_1.useClassNames)();
    return (react_1.default.createElement(List, { themes: themes, className: `${className} ${classNames.wrapper}` }, children));
};
const Item = styled_components_1.default.li ``;
const List = styled_components_1.default.ul(({ themes: { spacingByChar } }) => {
    return (0, styled_components_1.css) `
    position: fixed;
    bottom: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin: ${spacingByChar(1)};
    list-style: none;

    ${Item} {
      :not(:first-child) {
        margin-top: ${spacingByChar(1)};
      }
    }
  `;
});
const ListAndItem = Object.assign(BackgroundJobsList, {
    Item,
});
exports.BackgroundJobsList = ListAndItem;
//# sourceMappingURL=BackgroundJobsList.js.map