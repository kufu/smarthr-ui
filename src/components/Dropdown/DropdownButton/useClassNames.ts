import { useMemo } from 'react'

import { useClassNameGenerator } from '../../../hooks/useClassNameGenerator'

import { DropdownButton } from './DropdownButton'

export function useClassNames() {
  const generate = useClassNameGenerator(DropdownButton.displayName || 'DropdownButton')
  return useMemo(
    () => ({
      wrapper: generate(),
      trigger: generate('trigger'),
      panel: generate('panel'),
    }),
    [generate],
  )
}
