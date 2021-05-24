import { useMemo } from 'react'

import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'
import { CheckBoxLabelNew } from './CheckBoxLabelNew'

export function useClassNames() {
  const generate = useClassNameGenerator(CheckBoxLabelNew.displayName || 'CheckBoxLabelNew')
  return useMemo(
    () => ({
      wrapper: generate(),
      label: generate('label'),
      text: generate('text'),
    }),
    [generate],
  )
}
