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
exports.TdCheckbox = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const CheckBox_1 = require("../CheckBox");
const Layout_1 = require("../Layout");
const VisuallyHiddenText_1 = require("../VisuallyHiddenText");
const Td_1 = require("./Td");
exports.TdCheckbox = (0, react_1.forwardRef)(({ 'aria-labelledby': ariaLabelledby, children, className, ...others }, ref) => {
    const theme = (0, useTheme_1.useTheme)();
    return (
    // Td に必要な属性やイベントは不要
    react_1.default.createElement(Td, { className: className, themes: theme },
        react_1.default.createElement(Label, null,
            react_1.default.createElement(CheckBox_1.CheckBox, { ...others, ref: ref, "aria-labelledby": ariaLabelledby }),
            children && react_1.default.createElement(VisuallyHiddenText_1.VisuallyHiddenText, null, children))));
});
const Td = (0, styled_components_1.default)(Td_1.Td) `
  ${({ themes: { fontSize, space } }) => (0, styled_components_1.css) `
    position: relative;
    padding: ${space(0.75)};
    width: ${fontSize.M};
  `}
`;
const Label = (0, styled_components_1.default)(Layout_1.Center).attrs({ as: 'label', verticalCentering: true }) `
  position: absolute;
  inset: 0;

  &:not(:has([disabled])) {
    cursor: pointer;
  }
`;
//# sourceMappingURL=TdCheckbox.js.map