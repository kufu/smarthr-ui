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
exports.Cell = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const ua_1 = require("../../libs/ua");
const Table_1 = require("./Table");
const useClassNames_1 = require("./useClassNames");
/**
 * @deprecated Cell コンポーネントは非推奨です。代わりに Th または Td コンポーネントを使用してください。
 */
const Cell = ({ className = '', children, onClick, colSpan, rowSpan, highlighted = false, nullable = false, ...elementProps }) => {
    const theme = (0, useTheme_1.useTheme)();
    const { group } = (0, react_1.useContext)(Table_1.TableGroupContext);
    const classNames = (0, useClassNames_1.useClassNames)().cell;
    const wrapperClass = [
        className,
        highlighted && 'highlighted',
        nullable && 'nullable',
        classNames.wrapper,
    ]
        .filter((c) => !!c)
        .join(' ');
    const props = {
        children,
        onClick,
        colSpan,
        rowSpan,
        className: wrapperClass,
        themes: theme,
        ...elementProps,
    };
    if (group === 'head') {
        return react_1.default.createElement(Th, { ...props });
    }
    else if (group === 'body') {
        return react_1.default.createElement(Td, { ...props });
    }
    else {
        return null;
    }
};
exports.Cell = Cell;
const Th = styled_components_1.default.th `
  ${({ themes, onClick }) => {
    const { fontSize, leading, spacingByChar, color, interaction } = themes;
    return (0, styled_components_1.css) `
      height: calc(1em * ${leading.NORMAL} + ${spacingByChar(0.5)} * 2);
      font-size: ${fontSize.S};
      font-weight: bold;
      padding: ${spacingByChar(0.5)} ${spacingByChar(1)};
      color: ${color.TEXT_BLACK};
      transition: ${ua_1.isTouchDevice ? 'none' : `background-color ${interaction.hover.animation}`};
      text-align: left;
      line-height: 1.5;
      vertical-align: middle;
      box-sizing: border-box;

      &.highlighted {
        background-color: ${color.hoverColor(color.HEAD)};
      }

      ${onClick &&
        (0, styled_components_1.css) `
        :hover {
          background-color: ${color.hoverColor(color.HEAD)};
          cursor: pointer;
        }
      `}
    `;
}}
`;
const Td = styled_components_1.default.td `
  &.nullable {
    &:empty {
      &::after {
        content: '-----';
      }
    }
  }

  ${({ themes }) => {
    const { fontSize, leading, spacingByChar, color, border } = themes;
    return (0, styled_components_1.css) `
      color: ${color.TEXT_BLACK};
      height: calc(1em * ${leading.RELAXED} + ${spacingByChar(0.5)} * 2);
      padding: ${spacingByChar(0.5)} ${spacingByChar(1)};
      border-top: ${border.shorthand};
      font-size: ${fontSize.M};
      line-height: 1.5;
      vertical-align: middle;
      box-sizing: border-box;
    `;
}};
`;
//# sourceMappingURL=Cell.js.map