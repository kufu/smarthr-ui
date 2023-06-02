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
exports.FlashMessageList = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../../hooks/useTheme");
const FlashMessageListProvider_1 = require("./FlashMessageListProvider");
const Item_1 = require("./Item");
const FlashMessageList = () => {
    const theme = (0, useTheme_1.useTheme)();
    const { messages } = (0, react_1.useContext)(FlashMessageListProvider_1.FlashMessageListContext);
    return (react_1.default.createElement(List, { themes: theme }, messages.map((message) => (react_1.default.createElement(Item_1.Item, { ...message, key: message.seq })))));
};
exports.FlashMessageList = FlashMessageList;
const List = styled_components_1.default.ul `
  ${({ themes: { spacingByChar, zIndex } }) => (0, styled_components_1.css) `
    z-index: ${zIndex.FLASH_MESSAGE};
    position: fixed;
    display: flex;
    flex-direction: column-reverse;
    bottom: 0;
    left: 0;
    padding: 0;
    margin: ${spacingByChar(0.5)};
    list-style: none;
  `}
`;
//# sourceMappingURL=FlashMessageList.js.map