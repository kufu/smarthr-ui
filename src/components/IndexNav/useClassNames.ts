import { useMemo } from 'react'

import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'
import { IndexNav } from './IndexNav'

export function useClassNames() {
  const generate = useClassNameGenerator(IndexNav.displayName || 'IndexNav')
  return useMemo(
    () => ({
      wrapper: generate(),
      item: generate('item'),
      anchor: generate('anchor'),
    }),
    [generate],
  )
}
