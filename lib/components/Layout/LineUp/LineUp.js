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
exports.LineUp = void 0;
const styled_components_1 = __importStar(require("styled-components"));
const useSpacing_1 = require("../../../hooks/useSpacing");
/**
 * @deprecated LineUp コンポーネントは非推奨です。Cluster または Sidebar コンポーネントを使用してください。
 * @param inline true の場合は inline-flex
 * @param gap 間隔の指定（基準フォントサイズの相対値または抽象値）。align が space-between や space-around を取る場合は無視されます
 * @param reverse 並べる方向の指定（flex-direction）
 * @param align 並べ方の指定（justify-content）
 * @param vAlign 縦位置の揃え方（align-items）
 */
exports.LineUp = styled_components_1.default.div(({ inline = false, gap = 0.5, reverse, align = 'flex-start', vAlign = 'normal' }) => {
    return (0, styled_components_1.css) `
    display: ${inline ? 'inline-flex' : 'flex'};
    ${reverse && 'flex-direction: row-reverse;'}
    ${align && `justify-content: ${align};`}
    ${vAlign && `align-items: ${vAlign};`}
    gap: ${(0, useSpacing_1.useSpacing)(gap)};

    /* 
      Chromeで空の要素にflex-gapがあると印刷時にレイアウトが崩れるので gap の値を0にする
      See https://bugs.chromium.org/p/chromium/issues/detail?id=1161709
    */
    &:empty {
      gap: 0;
    }
  `;
});
//# sourceMappingURL=LineUp.js.map