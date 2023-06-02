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
exports.Sidebar = void 0;
const styled_components_1 = __importStar(require("styled-components"));
const useSpacing_1 = require("../../../hooks/useSpacing");
exports.Sidebar = styled_components_1.default.div(({ align = 'stretch', contentsMinWidth = '50%', gap = 1, right }) => {
    const isGapSeparate = gap instanceof Object;
    const gapValue = isGapSeparate
        ? (0, styled_components_1.css) `
          row-gap: ${(0, useSpacing_1.useSpacing)(gap.row)};
          column-gap: ${(0, useSpacing_1.useSpacing)(gap.column)};
        `
        : (0, styled_components_1.css) `
          gap: ${(0, useSpacing_1.useSpacing)(gap)};
        `;
    const sidebarValue = (0, styled_components_1.css) `
      flex-grow: 1;
    `;
    const mainContentsValue = (0, styled_components_1.css) `
      flex-basis: 0;
      flex-grow: 999;
      min-width: ${contentsMinWidth};
    `;
    return (0, styled_components_1.css) `
      display: flex;
      flex-wrap: wrap;
      align-items: ${align};
      ${gapValue}

      & > *:last-child {
        ${right ? sidebarValue : mainContentsValue}
      }

      & > *:first-child {
        ${right ? mainContentsValue : sidebarValue}
      }

      /* 
      Chromeで空の要素にflex-gapがあると印刷時にレイアウトが崩れるので gap の値を0にする
      See https://bugs.chromium.org/p/chromium/issues/detail?id=1161709
      */
      &:empty {
        gap: 0;
      }
    `;
});
//# sourceMappingURL=Sidebar.js.map