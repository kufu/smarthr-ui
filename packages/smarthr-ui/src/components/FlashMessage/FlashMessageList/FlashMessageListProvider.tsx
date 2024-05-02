import React, { ReactNode, VFC, createContext, useCallback, useState } from 'react'

import { Props as FlashMessageProps } from '../FlashMessage'

import { FlashMessageList } from './FlashMessageList'

type Message = Omit<FlashMessageProps, 'visible' | 'onClose'>
export type NumberedMessage = Message & { seq: number }

export const FlashMessageListContext = createContext<{
  messages: NumberedMessage[]
  enqueueMessage: (message: Message) => void
  dequeueMessage: (seq: number) => void
  isProvided: boolean
}>({
  messages: [],
  enqueueMessage: (_) => {
    // no-op
  },
  dequeueMessage: (_) => {
    // no-op
  },
  isProvided: false,
})

/**
 * @deprecated `FlashMessage` は気づきにくいため、安易な使用はお勧めしません。`NotificationBar` や `Dialog` の使用を検討してください。
 */
export const FlashMessageListProvider: VFC<{ children: ReactNode }> = ({ children }) => {
  const [currentSeq, setCurrentSeq] = useState(0)
  const [messages, setMessages] = useState<NumberedMessage[]>([])

  const enqueueMessage = useCallback(
    (message: Message) => {
      setMessages((_messages) => [..._messages, { ...message, seq: currentSeq }])
      setCurrentSeq(currentSeq + 1)
    },
    [currentSeq],
  )

  const dequeueMessage = useCallback((seq: number) => {
    setMessages((_messages) => _messages.filter((_message) => _message.seq !== seq))
  }, [])

  return (
    <FlashMessageListContext.Provider
      value={{ messages, enqueueMessage, dequeueMessage, isProvided: true }}
    >
      {children}
      <FlashMessageList />
    </FlashMessageListContext.Provider>
  )
}
