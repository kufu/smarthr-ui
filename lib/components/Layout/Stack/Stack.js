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
exports.Stack = void 0;
const styled_components_1 = __importStar(require("styled-components"));
const useSpacing_1 = require("../../../hooks/useSpacing");
/**
 * @param inline true の場合は inline-flex
 * @param gap 間隔の指定（基準フォントサイズの相対値または抽象値）
 * @param align 並べ方の指定（align-items）
 * @param recursive 直下の要素だけでなく再帰的に適用するかどうかの指定
 * @param splitAfter 分割する位置の指定（nth-child に渡す値）
 */
exports.Stack = styled_components_1.default.div(({ inline = false, gap = 1, align, recursive = false, splitAfter }) => (0, styled_components_1.css) `
      display: ${inline ? 'inline-flex' : 'flex'};
      flex-direction: column;
      ${align && `align-items: ${align};`}
      justify-content: flex-start;

      /* For greater specificity than element type selectors */
      &&& {
        ${!recursive && '>'} * {
          margin-top: 0;
          margin-bottom: 0;
        }

        ${!recursive && '>'} * + * {
          margin-top: ${(0, useSpacing_1.useSpacing)(gap)};
        }

        ${splitAfter &&
    (0, styled_components_1.css) `
          ${!recursive ? '> ' : '*'}:nth-child(${splitAfter}) {
            margin-bottom: auto;
          }
        `}
      }
    `);
//# sourceMappingURL=Stack.js.map