import { useMemo } from 'react'

import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'
import { DropZone } from './DropZone'

export function useClassNames() {
  const generate = useClassNameGenerator(DropZone.displayName || 'DropZone')
  return useMemo(
    () => ({
      wrapper: generate(),
    }),
    [generate],
  )
}
