"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFlashMessageList = void 0;
const react_1 = require("react");
const FlashMessageListProvider_1 = require("./FlashMessageListProvider");
/**
 * @deprecated `FlashMessage` は気づきにくいため、安易な使用はお勧めしません。`NotificationBar` や `Dialog` の使用を検討してください。
 */
function useFlashMessageList() {
    const { enqueueMessage, isProvided } = (0, react_1.useContext)(FlashMessageListProvider_1.FlashMessageListContext);
    if (!isProvided) {
        console.warn('No context is provided. Please wrap the upper layer that uses "useFlashMessageList" hook with "FlashMessageListProvider".');
    }
    return { enqueueMessage };
}
exports.useFlashMessageList = useFlashMessageList;
//# sourceMappingURL=useFlashMessageList.js.map