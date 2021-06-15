import { useMemo } from 'react'
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'
import { Footer } from './Footer'

export function useClassNames() {
  const generate = useClassNameGenerator(Footer.displayName || 'Footer')
  return useMemo(
    () => ({
      wrapper: generate(),
      list: generate('list'),
      listItem: generate('listItem'),
    }),
    [generate],
  )
}
