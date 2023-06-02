import React, { createContext, useCallback, useState } from 'react';
import { FlashMessageList } from './FlashMessageList';
export const FlashMessageListContext = createContext({
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
export const FlashMessageListProvider = ({ children }) => {
    const [currentSeq, setCurrentSeq] = useState(0);
    const [messages, setMessages] = useState([]);
    const enqueueMessage = useCallback((message) => {
        setMessages((_messages) => [..._messages, { ...message, seq: currentSeq }]);
        setCurrentSeq(currentSeq + 1);
    }, [currentSeq]);
    const dequeueMessage = useCallback((seq) => {
        setMessages((_messages) => _messages.filter((_message) => _message.seq !== seq));
    }, []);
    return (React.createElement(FlashMessageListContext.Provider, { value: { messages, enqueueMessage, dequeueMessage, isProvided: true } },
        children,
        React.createElement(FlashMessageList, null)));
};
//# sourceMappingURL=FlashMessageListProvider.js.map