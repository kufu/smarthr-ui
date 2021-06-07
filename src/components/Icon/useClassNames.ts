import { useMemo } from 'react'

import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'

export function useClassNames() {
  const generate = useClassNameGenerator(`Icon`)
  return useMemo(
    () => ({
      wrapper: generate(),
    }),
    [generate],
  )
}
