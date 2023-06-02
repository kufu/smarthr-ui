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
exports.Item = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../../hooks/useTheme");
const FlashMessage_1 = require("../FlashMessage");
const FlashMessageListProvider_1 = require("./FlashMessageListProvider");
const Item = ({ seq, ...message }) => {
    const theme = (0, useTheme_1.useTheme)();
    const { dequeueMessage } = (0, react_1.useContext)(FlashMessageListProvider_1.FlashMessageListContext);
    const handleClose = (0, react_1.useCallback)(() => {
        dequeueMessage(seq);
    }, [dequeueMessage, seq]);
    return (react_1.default.createElement(Li, { themes: theme },
        react_1.default.createElement(StaticFlashMessage, { ...message, visible: true, onClose: handleClose })));
};
exports.Item = Item;
const Li = styled_components_1.default.li `
  ${({ themes: { spacingByChar } }) => (0, styled_components_1.css) `
    margin-top: ${spacingByChar(0.5)};
  `}
`;
const StaticFlashMessage = (0, styled_components_1.default)(FlashMessage_1.FlashMessage) `
  position: static;
  display: inline-flex;
  top: auto;
  left: auto;
`;
//# sourceMappingURL=Item.js.map