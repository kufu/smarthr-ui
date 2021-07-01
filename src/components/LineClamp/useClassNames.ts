import { useMemo } from 'react'

import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'
import { LineClamp } from './LineClamp'

export function useClassNames() {
  const generate = useClassNameGenerator(LineClamp.displayName || 'LineClamp')
  return useMemo(
    () => ({
      wrapper: generate(),
    }),
    [generate],
  )
}
