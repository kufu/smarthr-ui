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
exports.HeaderDropdownMenuButton = void 0;
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const Dropdown_1 = require("../Dropdown");
exports.HeaderDropdownMenuButton = (0, styled_components_1.default)(Dropdown_1.DropdownMenuButton)(() => {
    const { color, space } = (0, useTheme_1.useTheme)();
    return (0, styled_components_1.css) `
    > .smarthr-ui-DropdownMenuButton-trigger {
      border-color: transparent;
      background-color: transparent;
      padding-inline: ${space(0.25)};
      color: ${color.TEXT_WHITE};
      font-weight: normal;

      &:last-of-type {
        /* ボタンの余白分だけ微調整 */
        margin-inline-end: ${space(-0.25)};
      }
    }
  `;
});
//# sourceMappingURL=HeaderDropdownMenuButton.js.map