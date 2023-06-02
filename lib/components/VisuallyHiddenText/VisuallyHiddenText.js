"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisuallyHiddenText = void 0;
const styled_components_1 = __importDefault(require("styled-components"));
exports.VisuallyHiddenText = styled_components_1.default.span `
  position: absolute;
  top: -1px;
  left: 0;
  width: 1px;
  height: 1px;
  border: 0;
  padding: 0;
  white-space: nowrap;
  clip-path: inset(100%);
  clip: rect(0 0 0 0);
  overflow: hidden;
`;
//# sourceMappingURL=VisuallyHiddenText.js.map