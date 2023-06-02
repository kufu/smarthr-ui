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
exports.Balloon = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const useClassNames_1 = require("./useClassNames");
const Balloon = ({ horizontal, vertical, className = '', ...props }) => {
    if (horizontal === 'center' && vertical === 'middle') {
        throw new Error('"vertical" can not be specified as "middle" when "horizontal" is "center".');
    }
    const themes = (0, useTheme_1.useTheme)();
    const { wrapper } = (0, useClassNames_1.useClassNames)();
    const classNames = `${horizontal} ${vertical} ${className} ${wrapper}`;
    return react_1.default.createElement(Base, { ...props, className: classNames, themes: themes });
};
exports.Balloon = Balloon;
// HINT: trianble部分はRetinaディスプレイなどで途切れてしまう場合があるので
// 1pxほど大きめに描画してbody部分と被るようにしています。
const Base = styled_components_1.default.div `
  ${({ themes }) => {
    const { border, color, fontSize } = themes;
    return (0, styled_components_1.css) `
      position: relative;
      display: inline-block;
      font-size: ${fontSize.S};
      border-radius: 4px;
      filter: drop-shadow(
        0 2px 2.5px rgba(0, 0, 0, 0.33)
      ); /* drop-shadow は spread-radius を受け付けないので shadow.LAYER2 に近い値をハードコーディングしている */
      white-space: nowrap;
      transform: translateZ(0); /* safari で filter を正しく描画するために必要 */

      &::after {
        display: block;
        position: absolute;
        content: '';
        background-color: ${color.WHITE};
      }

      background-color: ${color.WHITE};
      color: ${color.TEXT_BLACK};

      @media (prefers-contrast: more) {
        & {
          border: ${border.highContrast};
        }

        &::before {
          display: block;
          position: absolute;
          content: '';
          background-color: ${color.TEXT_BLACK};
        }
      }

      &.top {
        &::before,
        &::after {
          top: -4px;
          width: 10px;
          height: 5px;
          clip-path: polygon(50% 0, 100% 100%, 0 100%);
        }

        &::before {
          top: -5px;
        }
      }
      &.bottom {
        &::before,
        &::after {
          bottom: -4px;
          width: 10px;
          height: 5px;
          clip-path: polygon(0 0, 100% 0, 50% 100%);
        }

        &::before {
          bottom: -5px;
        }
      }

      &.right {
        &::before,
        &::after {
          right: 24px;
        }
      }
      &.center {
        &::before,
        &::after {
          left: 50%;
          transform: translateX(-5px);
        }
      }
      &.left {
        &::before,
        &::after {
          left: 24px;
        }
      }

      &.middle {
        &::before,
        &::after {
          top: 50%;
          transform: translateY(-5px);
        }
        &.left {
          &::before,
          &::after {
            left: -4px;
            width: 5px;
            height: 10px;
            clip-path: polygon(100% 0, 100% 100%, 0 50%);
          }

          &::before {
            left: -5px;
          }
        }
        &.right {
          &::before,
          &::after {
            right: -4px;
            width: 5px;
            height: 10px;
            clip-path: polygon(0 0, 100% 50%, 0 100%);
          }

          &::before {
            right: -5px;
          }
        }
      }
    `;
}}
`;
//# sourceMappingURL=Balloon.js.map