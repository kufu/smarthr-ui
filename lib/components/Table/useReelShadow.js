"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReelShadow = void 0;
const useTheme_1 = require("../../hooks/useTheme");
const useReelShadow = ({ showShadow = true, direction = 'left' }) => {
    const theme = (0, useTheme_1.useTheme)();
    const shadowWidth = theme.space(0.75);
    return `
    &::after {
      content: '';
      position: absolute;
      z-index: 0;
      inset-block: 0;
      left: ${direction === 'left' ? '0' : `-${shadowWidth}`};
      width: ${shadowWidth};
      pointer-events: none; /* 影の領域が広すぎるとクリッカブルエリアを侵食するので無効化 */
      background: linear-gradient(${direction === 'left' ? '90deg' : '-90deg'}, rgba(0, 0, 0, 0.2) 0%, transparent 100%);
      opacity: ${showShadow ? 1 : 0};
      transition: opacity 0.2s;
    }
  `;
};
exports.useReelShadow = useReelShadow;
//# sourceMappingURL=useReelShadow.js.map