import React, { ReactNode, VFC } from 'react';
import { Props as FlashMessageProps } from '../FlashMessage';
type Message = Omit<FlashMessageProps, 'visible' | 'onClose'>;
export type NumberedMessage = Message & {
    seq: number;
};
export declare const FlashMessageListContext: React.Context<{
    messages: NumberedMessage[];
    enqueueMessage: (message: Message) => void;
    dequeueMessage: (seq: number) => void;
    isProvided: boolean;
}>;
/**
 * @deprecated `FlashMessage` は気づきにくいため、安易な使用はお勧めしません。`NotificationBar` や `Dialog` の使用を検討してください。
 */
export declare const FlashMessageListProvider: VFC<{
    children: ReactNode;
}>;
export {};
