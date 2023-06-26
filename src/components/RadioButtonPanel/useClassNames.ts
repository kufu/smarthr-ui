import { useMemo } from 'react'

import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'

import { RadioButtonPanel } from './RadioButtonPanel'

export const useClassNames = (className: string = '') => {
  const generate = useClassNameGenerator(RadioButtonPanel.displayName || 'RadioButtonPanel')

  return useMemo(
    () => ({
      wrapper: `${className} ${generate()}`,
    }),
    [className, generate],
  )
}
