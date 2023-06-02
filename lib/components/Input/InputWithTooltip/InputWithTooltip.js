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
exports.InputWithTooltip = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const Tooltip_1 = require("../../Tooltip");
const Input_1 = require("../Input");
exports.InputWithTooltip = (0, react_1.forwardRef)(({ tooltipMessage, width, ...props }, ref) => {
    const widthStyle = typeof width === 'number' ? `${width}px` : width;
    return (react_1.default.createElement(Tooltip, { width: widthStyle, message: tooltipMessage, tabIndex: -1, ariaDescribedbyTarget: "inner" },
        react_1.default.createElement(Input_1.Input, { ...props, width: widthStyle, ref: ref })));
});
const Tooltip = (0, styled_components_1.default)(Tooltip_1.Tooltip)(({ width }) => (0, styled_components_1.css) `
    /* Input のフォーカスリングを表示するため */
    overflow: revert;
    ${width && `width: ${width};`}
  `);
//# sourceMappingURL=InputWithTooltip.js.map