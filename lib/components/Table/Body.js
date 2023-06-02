"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Body = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const Table_1 = require("./Table");
const useClassNames_1 = require("./useClassNames");
/**
 * @deprecated Body コンポーネントは非推奨です。tbody 要素に置き換えてください。
 */
const Body = ({ className = '', children, ...props }) => {
    const classNames = (0, useClassNames_1.useClassNames)().body;
    const theme = (0, useTheme_1.useTheme)();
    return (react_1.default.createElement(Wrapper, { ...props, themes: theme, className: `${className} ${classNames.wrapper}` },
        react_1.default.createElement(Table_1.TableGroupContext.Provider, { value: { group: 'body' } }, children)));
};
exports.Body = Body;
const Wrapper = styled_components_1.default.tbody `
  background-color: ${({ themes }) => themes.color.WHITE};
`;
//# sourceMappingURL=Body.js.map