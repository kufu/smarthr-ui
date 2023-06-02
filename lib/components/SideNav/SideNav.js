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
exports.SideNav = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const SideNavItem_1 = require("./SideNavItem");
const useClassNames_1 = require("./useClassNames");
const SideNav = ({ items, size = 'default', onClick, className = '', ...props }) => {
    const theme = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useClassNames)();
    return (react_1.default.createElement(Wrapper, { ...props, themes: theme, className: `${className} ${classNames.wrapper}` }, items.map((item) => (react_1.default.createElement(SideNavItem_1.SideNavItem, { id: item.id, title: item.title, prefix: item.prefix, isSelected: item.isSelected, size: size, key: item.id, onClick: onClick })))));
};
exports.SideNav = SideNav;
const Wrapper = styled_components_1.default.ul `
  ${({ themes }) => {
    const { color } = themes;
    return (0, styled_components_1.css) `
      background-color: ${color.COLUMN};
      list-style: none;
      padding: 0;
    `;
}}
`;
//# sourceMappingURL=SideNav.js.map