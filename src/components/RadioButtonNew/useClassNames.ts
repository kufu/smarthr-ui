import { useMemo } from 'react'

import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'
import { RadioButtonNew } from './RadioButtonNew'

export function useClassNames() {
  const generate = useClassNameGenerator(RadioButtonNew.displayName || 'RadioButtonNew')

  return useMemo(
    () => ({
      wrapper: generate(),
      radioButton: generate('radioButton'),
      label: generate('label'),
    }),
    [generate],
  )
}
