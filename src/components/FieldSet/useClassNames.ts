import { useMemo } from 'react'

import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'
import { FieldSet } from './FieldSet'

export function useClassNames() {
  const generate = useClassNameGenerator(FieldSet.displayName || 'FieldSet')
  return useMemo(
    () => ({
      wrapper: generate(),
      title: generate('title'),
      titleText: generate('titleText'),
      label: generate('label'),
      input: generate('input'),
      error: generate('error'),
      errorIcon: generate('errorIcon'),
      errorText: generate('errorText'),
      help: generate('help'),
    }),
    [generate],
  )
}
