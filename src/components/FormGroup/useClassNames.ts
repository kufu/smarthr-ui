import { useMemo } from 'react'

import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'

import { FormGroup } from '.'

export function useClassNames() {
  const generate = useClassNameGenerator(FormGroup.displayName || 'FormGroup')
  return useMemo(
    () => ({
      wrapper: generate(),
      childrenWrapper: generate('childrenWrapper'),
      label: generate('label'),
      helpMessage: generate('helpMessage'),
      errorMessage: generate('errorMessage'),
    }),
    [generate],
  )
}
