import { useMemo } from 'react'

import { useClassNameGenerator } from '../../../hooks/useClassNameGenerator'

import { CurrencyInput } from './CurrencyInput'

export function useClassNames() {
  const generate = useClassNameGenerator(CurrencyInput.displayName || 'CurrencyInput')
  return useMemo(
    () => ({
      wrapper: generate(),
    }),
    [generate],
  )
}
