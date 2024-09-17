import React from 'react'

export const useId = (defaultId?: string): string => {
  const id = React.useId()
  return defaultId || id
}
