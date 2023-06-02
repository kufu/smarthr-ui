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
exports.Td = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const useClassNames_1 = require("./useClassNames");
const useReelShadow_1 = require("./useReelShadow");
const Td = ({ nullable = false, fixed = false, className = '', ...props }) => {
    const theme = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useTdClassNames)();
    const wrapperClass = [className, nullable && 'nullable', classNames.wrapper]
        .filter((c) => !!c)
        .join(' ');
    return (react_1.default.createElement(StyledTd, { ...props, className: `${wrapperClass} ${fixed ? 'fixedElement' : ''}`, themes: theme, fixed: fixed }));
};
exports.Td = Td;
const StyledTd = styled_components_1.default.td `
  &.nullable {
    &:empty {
      &::after {
        content: '-----';
      }
    }
  }

  ${({ themes, fixed }) => {
    const { fontSize, leading, spacingByChar, color, border } = themes;
    return (0, styled_components_1.css) `
      color: ${color.TEXT_BLACK};
      height: calc(1em * ${leading.NORMAL});
      padding: ${spacingByChar(0.5)} ${spacingByChar(1)};
      border-top: ${border.shorthand};
      font-size: ${fontSize.M};
      line-height: ${leading.NORMAL};
      vertical-align: middle;
      position: relative;

      /* これ以降の記述はTableReel内で'fixed'を利用した際に追従させるために必要 */
      &.fixedElement {
        ${(0, useReelShadow_1.useReelShadow)({ showShadow: false, direction: 'right' })}
      }

      ${fixed &&
        (0, styled_components_1.css) `
        &.fixed {
          position: sticky;
          right: 0;
          background-color: ${color.WHITE};

          &::after {
            opacity: 1;
          }
        }
      `}
    `;
}};
`;
//# sourceMappingURL=Td.js.map