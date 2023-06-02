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
exports.StatusLabel = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const Icon_1 = require("../Icon");
const useClassNames_1 = require("./useClassNames");
const StatusLabel = ({ type = 'grey', bold = false, className = '', children, ...props }) => {
    const theme = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useClassNames)();
    const Icon = (0, react_1.useMemo)(() => {
        switch (true) {
            case type === 'warning' && bold: {
                return Icon_1.FaExclamationTriangleIcon;
            }
            case type === 'error' && bold: {
                return Icon_1.FaExclamationCircleIcon;
            }
            default: {
                return react_1.default.Fragment;
            }
        }
    }, [type, bold]);
    return (react_1.default.createElement(Wrapper, { ...props, themes: theme, className: `${type}${bold ? ' bold' : ''} ${className} ${classNames.wrapper}` },
        react_1.default.createElement(Icon, null),
        children));
};
exports.StatusLabel = StatusLabel;
const Wrapper = styled_components_1.default.span `
  ${({ themes: { border, color, fontSize, spacingByChar } }) => (0, styled_components_1.css) `
      box-sizing: content-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: ${spacingByChar(0.25)};
      border: ${border.lineWidth} solid transparent;
      background-color: ${color.WHITE};
      padding: ${spacingByChar(0.25)} ${spacingByChar(0.5)};
      white-space: nowrap;
      font-size: ${fontSize.S};
      font-weight: bold;

      /** ラベルが天地中央に揃わないため暫定対応 */
      line-height: 0;
      min-width: 3.5em;
      min-height: 1em;

      &.grey {
        border-color: ${color.BORDER};
        color: ${color.TEXT_GREY};

        @media (prefers-contrast: more) {
          & {
            border: ${border.highContrast};
          }
        }

        &.bold {
          border-color: ${color.TEXT_GREY};
          background-color: ${color.TEXT_GREY};
          color: ${color.TEXT_WHITE};
        }
      }

      &.blue {
        border-color: ${color.MAIN};
        color: ${color.MAIN};

        &.bold {
          background-color: ${color.MAIN};
          color: ${color.TEXT_WHITE};
        }
      }

      &.green {
        /* SmartHR 基本色の Aqua04。StatusLabel 以外では使いません。
         * https://smarthr.design/basics/colors/#h4-1 */
        border-color: #0f7f85;
        color: #0f7f85;

        &.bold {
          background-color: #0f7f85;
          color: ${color.TEXT_WHITE};
        }
      }

      &.red {
        border-color: ${color.DANGER};
        color: ${color.DANGER};
      }
      &.red.bold,
      &.error {
        background-color: ${color.DANGER};
        color: ${color.TEXT_WHITE};
      }

      &.warning {
        background-color: ${color.WARNING_YELLOW};
        color: ${color.TEXT_BLACK};

        &.bold {
          border-color: ${color.TEXT_BLACK};
        }
      }
    `}
`;
//# sourceMappingURL=StatusLabel.js.map