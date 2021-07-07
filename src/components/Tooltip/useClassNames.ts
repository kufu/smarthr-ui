import { useMemo } from 'react'

import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'

export function useClassNames() {
  const generate = useClassNameGenerator('Tooltip')
  return useMemo(
    () => ({
      wrapper: generate(),
      popup: generate('popup'),
    }),
    [generate],
  )
}
