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
exports.Table = exports.TableGroupContext = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const useClassNames_1 = require("./useClassNames");
exports.TableGroupContext = (0, react_1.createContext)({
    group: 'body',
});
const Table = ({ fixedHead = false, children, className = '', ...props }) => {
    const theme = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useClassNames)().table;
    return (react_1.default.createElement(Wrapper, { ...props, fixedHead: fixedHead, themes: theme, className: `${className} ${classNames.wrapper}` }, children));
};
exports.Table = Table;
const Wrapper = styled_components_1.default.table `
  ${({ fixedHead, themes }) => {
    const { border, color, zIndex } = themes;
    return (0, styled_components_1.css) `
      width: 100%;
      border-collapse: separate; /* Headがfixed=trueの場合、separate以外だとHeadとBodyの間に隙間が生まれるため、明示的に指定しています */
      border-spacing: 0;
      background-color: ${color.COLUMN};

      thead {
        ${fixedHead &&
        (0, styled_components_1.css) `
          position: sticky;
          top: 0;
          left: 0;
          z-index: ${zIndex.FIXED_MENU}; /* zIndexの値はセマンティックトークンとして管理しているため、明示的に値を指定しないと重なり順が崩れるため設定しています */
        `}
      }

      tbody {
        background-color: ${color.WHITE};
      }

      th {
        background-color: ${color.HEAD};
      }

      @media (prefers-contrast: more) {
        &,
        & th,
        & td {
          border: ${border.highContrast};
        }
      }
    `;
}}
`;
//# sourceMappingURL=Table.js.map