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
exports.SpreadsheetTableCorner = void 0;
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
exports.SpreadsheetTableCorner = styled_components_1.default.th(() => {
    const { color, leading, space } = (0, useTheme_1.useTheme)();
    return (0, styled_components_1.css) `
    position: relative;

    &::before {
      content: '';
      position: absolute;
      right: calc(${space(0.25)} / 2);
      bottom: calc(${space(0.25)} / 2);
      display: block;
      background-color: ${color.ACTION_BACKGROUND};
      padding: calc(${space(0.25)} / 2);
      clip-path: polygon(0 100%, 100% 0, 100% 100%);
      width: calc(1em * ${leading.NORMAL});
      height: calc(1em * ${leading.NORMAL});
    }
  `;
});
//# sourceMappingURL=SpreadsheetTableCorner.js.map