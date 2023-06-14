import { useMemo } from 'react'

import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'

import { FlashMessage } from './FlashMessage'

export const useClassNames = () => {
  const generate = useClassNameGenerator(FlashMessage.displayName || 'FlashMessage')

  return useMemo(
    () => ({
      wrapper: generate(),
      icon: generate('icon'),
      button: generate('button'),
    }),
    [generate],
  )
}
