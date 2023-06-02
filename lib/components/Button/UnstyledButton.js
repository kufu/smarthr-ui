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
exports.UnstyledButton = void 0;
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
exports.UnstyledButton = styled_components_1.default.button `
  ${() => {
    const { shadow } = (0, useTheme_1.useTheme)();
    return (0, styled_components_1.css) `
      appearance: none;
      display: inline;
      align-items: stretch;
      overflow: visible;
      cursor: auto;
      padding: 0;
      border-style: none;
      border-width: medium;
      border-color: currentColor;
      /* stylelint-disable declaration-block-no-redundant-longhand-properties */
      border-image-source: none;
      border-image-slice: 100%;
      border-image-width: 1;
      border-image-outset: 0;
      border-image-repeat: stretch;
      /* stylelint-enable declaration-block-no-redundant-longhand-properties */
      box-sizing: content-box;
      background-color: transparent;
      background-image: none;
      background-origin: padding-box;
      color: inherit;
      font-family: inherit;
      font-size: inherit;
      text-align: left;
      user-select: auto;
      zoom: auto;

      &:focus-visible {
        ${shadow.focusIndicatorStyles}
      }
    `;
}}
`;
//# sourceMappingURL=UnstyledButton.js.map