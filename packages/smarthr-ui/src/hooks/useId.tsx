import React from 'react'

export const useId = (defaultId?: string): string => {
  if (defaultId) return defaultId
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return React.useId()
}
