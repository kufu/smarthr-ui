import { useContext } from 'react'

import { FlashMessageListContext } from './FlashMessageListProvider'

export function useFlashMessageList() {
  const { enqueueMessage, isProvided } = useContext(FlashMessageListContext)
  if (!isProvided) {
    console.warn(
      'No context is provided. Please wrap the upper layer that uses "useFlashMessageList" hook with "FlashMessageListProvder".',
    )
  }
  return { enqueueMessage }
}
