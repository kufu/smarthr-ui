import { useMemo } from 'react'

import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'
import { RadioButtonLabelNew } from './RadioButtonLabelNew'

export function useClassNames() {
  const generate = useClassNameGenerator(RadioButtonLabelNew.displayName || 'RadioButtonLabelNew')

  return useMemo(
    () => ({
      wrapper: generate(),
      radioButton: generate('radioButton'),
      label: generate('label'),
    }),
    [generate],
  )
}
