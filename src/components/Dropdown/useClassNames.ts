import { useMemo } from 'react'
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'
import { Dropdown } from './Dropdown'

export const useClassName = () => {
  const generate = useClassNameGenerator(Dropdown.displayName || 'Dropdown')
  return useMemo(
    () => ({
      wrapper: generate(),
    }),
    [generate],
  )
}
