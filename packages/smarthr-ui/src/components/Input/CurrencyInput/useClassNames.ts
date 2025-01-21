import { useMemo } from 'react'

import { useClassNameGenerator } from '../../../hooks/useClassNameGenerator'

import { CurrencyInput } from './CurrencyInput'

export function useClassNames(className: string) {
  const generate = useClassNameGenerator(CurrencyInput.displayName || 'CurrencyInput')

  return useMemo(
    () => ({
      wrapper: `${className} ${generate()}`,
    }),
    [generate, className],
  )
}
