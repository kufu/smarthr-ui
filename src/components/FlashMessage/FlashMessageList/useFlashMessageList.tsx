import { useContext } from 'react'

import { FlashMessageListContext } from './FlashMessageListProvider'

export function useFlashMessageList() {
  const { enqueueMessage } = useContext(FlashMessageListContext)
  return { enqueueMessage }
}
