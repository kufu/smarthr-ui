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
exports.FlashMessageListProvider = exports.FlashMessageListContext = void 0;
const react_1 = __importStar(require("react"));
const FlashMessageList_1 = require("./FlashMessageList");
exports.FlashMessageListContext = (0, react_1.createContext)({
    messages: [],
    enqueueMessage: (_) => {
        // no-op
    },
    dequeueMessage: (_) => {
        // no-op
    },
    isProvided: false,
});
/**
 * @deprecated `FlashMessage` は気づきにくいため、安易な使用はお勧めしません。`NotificationBar` や `Dialog` の使用を検討してください。
 */
const FlashMessageListProvider = ({ children }) => {
    const [currentSeq, setCurrentSeq] = (0, react_1.useState)(0);
    const [messages, setMessages] = (0, react_1.useState)([]);
    const enqueueMessage = (0, react_1.useCallback)((message) => {
        setMessages((_messages) => [..._messages, { ...message, seq: currentSeq }]);
        setCurrentSeq(currentSeq + 1);
    }, [currentSeq]);
    const dequeueMessage = (0, react_1.useCallback)((seq) => {
        setMessages((_messages) => _messages.filter((_message) => _message.seq !== seq));
    }, []);
    return (react_1.default.createElement(exports.FlashMessageListContext.Provider, { value: { messages, enqueueMessage, dequeueMessage, isProvided: true } },
        children,
        react_1.default.createElement(FlashMessageList_1.FlashMessageList, null)));
};
exports.FlashMessageListProvider = FlashMessageListProvider;
//# sourceMappingURL=FlashMessageListProvider.js.map