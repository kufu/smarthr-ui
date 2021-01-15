import { useMemo } from 'react'

import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'

export function useClassNames() {
  const generate = useClassNameGenerator('AccordionPanel')
  return useMemo(
    () => ({
      wrapper: generate(),
      item: generate('item'),
      trigger: generate('trigger'),
      content: generate('content'),
    }),
    [generate],
  )
}
