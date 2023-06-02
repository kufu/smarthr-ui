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
exports.Center = void 0;
const styled_components_1 = __importStar(require("styled-components"));
const useSpacing_1 = require("../../../hooks/useSpacing");
exports.Center = styled_components_1.default.div(({ minHeight, maxWidth, padding, verticalCentering = false }) => {
    return (0, styled_components_1.css) `
    box-sizing: content-box;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: column;
    align-items: center;

    ${minHeight && `min-height: ${minHeight};`}
    ${maxWidth && `max-width: ${maxWidth};`}
    ${padding && `padding: ${(0, useSpacing_1.useSpacing)(padding)};`}
    ${verticalCentering && 'justify-content: center;'}
  `;
});
//# sourceMappingURL=Center.js.map