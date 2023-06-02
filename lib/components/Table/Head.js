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
exports.Head = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const Table_1 = require("./Table");
const useClassNames_1 = require("./useClassNames");
/**
 * @deprecated Head コンポーネントは非推奨です。thead 要素に置き換えてください。
 * thead 部分を固定表示する場合は Table コンポーネントの fixedHead Props を指定してください。
 * bulkActionArea を使う場合は BulkActionRow コンポーネントを使用してください。
 */
const Head = ({ bulkActionArea, className = '', fixed = false, children, ...props }) => {
    const themes = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useClassNames)().head;
    return (react_1.default.createElement(StyledThead, { ...props, className: className, themes: themes, "$fixed": fixed },
        react_1.default.createElement(Table_1.TableGroupContext.Provider, { value: { group: 'head' } }, children),
        bulkActionArea && (react_1.default.createElement("tr", { className: classNames.bulkActionArea },
            react_1.default.createElement(BulkActionTD, { colSpan: 1000, themes: themes }, bulkActionArea)))));
};
exports.Head = Head;
const StyledThead = styled_components_1.default.thead(({ themes, $fixed }) => {
    const { zIndex } = themes;
    return ($fixed &&
        (0, styled_components_1.css) `
      position: sticky;
      top: 0;
      left: 0;
      z-index: ${zIndex.FIXED_MENU}; /* zIndexの値はセマンティックトークンとして管理しているため、明示的に値を指定しないと重なり順が崩れるため設定しています */
    `);
});
const BulkActionTD = styled_components_1.default.td(({ themes }) => {
    const { fontSize, border, color, spacingByChar } = themes;
    return (0, styled_components_1.css) `
    border-top: ${border.shorthand};
    background-color: ${color.ACTION_BACKGROUND};
    padding: ${spacingByChar(1)};
    font-size: ${fontSize.M};
  `;
});
//# sourceMappingURL=Head.js.map