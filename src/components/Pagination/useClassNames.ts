import { useMemo } from 'react'

import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'
import { Pagination } from './Pagination'

export function useClassNames() {
  const generate = useClassNameGenerator(Pagination.displayName || 'Pagination')
  return useMemo(
    () => ({
      wrapper: generate(),
      page: generate('page'),
      start: generate('start'),
      prev: generate('prev'),
      next: generate('next'),
      end: generate('end'),
    }),
    [generate],
  )
}
