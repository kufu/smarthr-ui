import { useMemo } from 'react'

import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'

import { RadioButton } from './RadioButton'

export function useClassNames() {
  const generate = useClassNameGenerator(RadioButton.displayName || 'RadioButton')

  return useMemo(
    () => ({
      wrapper: generate(),
      radioButton: generate('radioButton'),
      label: generate('label'),
    }),
    [generate],
  )
}
