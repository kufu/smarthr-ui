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
exports.DialogBase = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const useClassNames_1 = require("./useClassNames");
const radiusMap = {
    s: '6px',
    m: '8px',
};
/**
 * @deprecated The DialogBase component is deprecated, so use Base component instead.
 */
exports.DialogBase = (0, react_1.forwardRef)(({ radius = 'm', className = '', ...props }, ref) => {
    const themes = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useClassNames)();
    return (react_1.default.createElement(Wrapper, { ...props, className: `${className} ${classNames.dialogBase.wrapper}`, themes: themes, "$radius": radiusMap[radius], ref: ref }));
});
const Wrapper = styled_components_1.default.div `
  ${({ themes: { color, shadow }, $radius }) => {
    return (0, styled_components_1.css) `
      box-shadow: ${shadow.LAYER3};
      border-radius: ${$radius};
      background-color: ${color.WHITE};
    `;
}}
`;
//# sourceMappingURL=DialogBase.js.map