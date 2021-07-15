import { useMemo } from 'react'

import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'
import { CheckBox } from './CheckBox'

export function useClassNames() {
  const generate = useClassNameGenerator(CheckBox.displayName || 'CheckBox')

  return useMemo(
    () => ({
      wrapper: generate(),
      checkBox: generate('checkBox'),
      label: generate('label'),
    }),
    [generate],
  )
}
