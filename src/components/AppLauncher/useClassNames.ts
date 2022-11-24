import { useMemo } from 'react'
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'
import { AppLauncher } from './AppLauncher'

export function useClassNames() {
  const generate = useClassNameGenerator(AppLauncher.displayName || 'Header')
  return useMemo(
    () => ({
      wrapper: generate(),
      category: generate('category'),
      link: generate('link'),
    }),
    [generate],
  )
}
