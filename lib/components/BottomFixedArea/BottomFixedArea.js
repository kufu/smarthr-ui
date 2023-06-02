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
exports.BottomFixedArea = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const Base_1 = require("../Base");
const Layout_1 = require("../Layout");
const TertiaryLink_1 = require("./TertiaryLink");
const bottomFixedAreaHelper_1 = require("./bottomFixedAreaHelper");
const useClassNames_1 = require("./useClassNames");
const BottomFixedArea = ({ description, primaryButton, secondaryButton, tertiaryLinks, zIndex = 500, className = '', ...props }) => {
    const theme = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useClassNames)();
    (0, react_1.useEffect)(() => {
        (0, bottomFixedAreaHelper_1.validateElement)(primaryButton, secondaryButton);
    }, [primaryButton, secondaryButton]);
    return (react_1.default.createElement(Base, { ...props, themes: theme, zIndex: zIndex, className: `${className} ${classNames.wrapper}` },
        react_1.default.createElement(Layout_1.Stack, null,
            description && react_1.default.createElement(Text, { className: classNames.description }, description),
            (secondaryButton || primaryButton) && (react_1.default.createElement(ListCluster, { justify: "center", gap: { row: 0.5, column: 1 } },
                secondaryButton && react_1.default.createElement("li", { className: classNames.secondaryButton }, secondaryButton),
                primaryButton && react_1.default.createElement("li", { className: classNames.primaryButton }, primaryButton))),
            tertiaryLinks && tertiaryLinks.length > 0 && (react_1.default.createElement(ListCluster, { justify: "center", gap: { row: 0.5, column: 1 } }, tertiaryLinks.map((tertiaryLink, index) => (react_1.default.createElement("li", { key: index, className: classNames.tertiaryListItem },
                react_1.default.createElement(TertiaryLink_1.TertiaryLink, { ...tertiaryLink })))))))));
};
exports.BottomFixedArea = BottomFixedArea;
const Base = (0, styled_components_1.default)(Base_1.Base) `
  ${({ themes: { spacingByChar }, zIndex }) => {
    return (0, styled_components_1.css) `
      position: fixed;
      bottom: 0;
      width: 100%;
      padding: ${spacingByChar(1.5)};
      text-align: center;
      z-index: ${zIndex};
      box-shadow: 0 -4px 8px 2px rgba(0, 0, 0, 0.24);
      border-radius: 0;
      box-sizing: border-box;
    `;
}}
`;
const Text = styled_components_1.default.div `
  margin: 0;
`;
const ListCluster = (0, styled_components_1.default)(Layout_1.Cluster).attrs({
    as: 'ul',
}) `
  list-style: none;
  margin: 0;
  padding: 0;
`;
//# sourceMappingURL=BottomFixedArea.js.map