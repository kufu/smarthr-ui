import { VFC, useMemo } from 'react'

import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'
import { Select } from './Select'

export function useClassNames() {
  const generate = useClassNameGenerator((Select as VFC).displayName || 'Select')
  return useMemo(
    () => ({
      wrapper: generate(),
    }),
    [generate],
  )
}
