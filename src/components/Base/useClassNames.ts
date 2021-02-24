import { useMemo } from 'react'
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'
import { Base } from './Base'

export const useClassNames = () => {
  const generate = useClassNameGenerator(Base.displayName || 'Base')

  return useMemo(
    () => ({
      wrapper: generate(),
    }),
    [generate],
  )
}
