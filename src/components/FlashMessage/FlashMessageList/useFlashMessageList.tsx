import { useContext } from 'react'

import { FlashMessageListContext } from './FlashMessageListProvider'

/**
 * @deprecated `FlashMessage` はアテンションとして強くないため、安易な使用はお勧めしません。`NotificationBar` や `Dialog` を使用することを検討してください。
 */
export function useFlashMessageList() {
  const { enqueueMessage, isProvided } = useContext(FlashMessageListContext)
  if (!isProvided) {
    console.warn(
      'No context is provided. Please wrap the upper layer that uses "useFlashMessageList" hook with "FlashMessageListProvider".',
    )
  }
  return { enqueueMessage }
}
