import { useMemo } from 'react'

import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'
import { CheckBoxNew } from './CheckBoxNew'

export function useClassNames() {
  const generate = useClassNameGenerator(CheckBoxNew.displayName || 'CheckBoxNew')

  return useMemo(
    () => ({
      wrapper: generate(),
      checkBox: generate('checkBox'),
      label: generate('label'),
    }),
    [generate],
  )
}
