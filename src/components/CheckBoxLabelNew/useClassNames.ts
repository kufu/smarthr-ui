import { useMemo } from 'react'

import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'
import { CheckBoxLabelNew } from './CheckBoxLabelNew'

export function useClassNames() {
  const generate = useClassNameGenerator(CheckBoxLabelNew.displayName || 'CheckBoxLabelNew')

  return useMemo(
    () => ({
      wrapper: generate(),
      checkBox: generate('checkBox'),
      label: generate('label'),
    }),
    [generate],
  )
}
