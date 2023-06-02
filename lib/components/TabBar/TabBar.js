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
exports.TabBar = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const Layout_1 = require("../Layout");
const useClassNames_1 = require("./useClassNames");
const TabBar = ({ className = '', bordered = true, children, ...props }) => {
    const theme = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useClassNames)().tabBar;
    const wrapperClass = `${className} ${classNames.wrapper}`;
    return (react_1.default.createElement(Layout_1.Reel, { ...props, role: "tablist", className: wrapperClass },
        react_1.default.createElement(Inner, { className: bordered ? 'bordered' : undefined, themes: theme }, children)));
};
exports.TabBar = TabBar;
const Inner = styled_components_1.default.div `
  ${({ themes }) => {
    const { border, shadow } = themes;
    return (0, styled_components_1.css) `
      flex-grow: 1;
      margin: ${shadow.OUTLINE_MARGIN};

      &.bordered {
        position: relative;

        ::before {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          border-bottom: ${border.shorthand};
          content: '';
        }
      }
    `;
}}
`;
//# sourceMappingURL=TabBar.js.map