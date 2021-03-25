import { useMemo } from 'react'

import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'
import { CheckBoxLabel } from './CheckBoxLabel'

export function useClassNames() {
  const generate = useClassNameGenerator(CheckBoxLabel.displayName || 'CheckBoxLabel')
  return useMemo(
    () => ({
      wrapper: generate(),
      label: generate('label'),
      text: generate('text'),
    }),
    [generate],
  )
}
