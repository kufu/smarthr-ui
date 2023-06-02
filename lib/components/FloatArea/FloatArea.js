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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloatArea = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useSpacing_1 = require("../../hooks/useSpacing");
const useTheme_1 = require("../../hooks/useTheme");
const Base_1 = require("../Base");
const Layout_1 = require("../Layout");
const Text_1 = require("../Text");
const useClassNames_1 = require("./useClassNames");
const FloatArea = ({ primaryButton, secondaryButton, tertiaryButton, errorText, errorIcon, fixed = false, className = '', width, ...props }) => {
    const theme = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useClassNames)();
    return (react_1.default.createElement(Base, { ...props, themes: theme, className: `${className} ${classNames.wrapper}`, "$width": width, fixed: fixed },
        react_1.default.createElement(Layout_1.Cluster, { gap: 1 },
            tertiaryButton && tertiaryButton,
            react_1.default.createElement(RightSide, null,
                react_1.default.createElement(Layout_1.Cluster, { gap: 1 },
                    errorText && (react_1.default.createElement(ErrorMessage, { gap: 0.25, vAlign: "center", as: "p", className: classNames.errorText },
                        errorIcon && react_1.default.createElement(ErrorIcon, { themes: theme }, errorIcon),
                        react_1.default.createElement(Text_1.Text, { size: "S" }, errorText))),
                    react_1.default.createElement(Layout_1.Cluster, { gap: 1 },
                        secondaryButton && secondaryButton,
                        primaryButton && primaryButton))))));
};
exports.FloatArea = FloatArea;
const Base = (0, styled_components_1.default)(Base_1.Base).attrs({ layer: 3 }) `
  ${({ themes: { space }, top, bottom, $width, fixed, zIndex = 500 }) => (0, styled_components_1.css) `
      position: ${fixed ? 'fixed' : 'sticky'};
      ${(top || top === 0) && `top: ${(0, useSpacing_1.useSpacing)(top)};`}
      ${(bottom || bottom === 0) && `bottom: ${(0, useSpacing_1.useSpacing)(bottom)};`}
      z-index: ${zIndex};
      padding: ${space(1)};
      ${$width && `width: ${$width};`}
    `}
`;
const RightSide = styled_components_1.default.div `
  margin-left: auto;
`;
const ErrorMessage = (0, styled_components_1.default)(Layout_1.LineUp) `
  margin-top: 0;
  margin-bottom: 0;
`;
const ErrorIcon = styled_components_1.default.span `
  flex-shrink: 0;

  > svg {
    display: block; /* 隙間対策 */
  }
`;
//# sourceMappingURL=FloatArea.js.map