import { useMemo } from 'react'

import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'

import { CompactInformationPanel } from './CompactInformationPanel'

export function useClassNames() {
  const generate = useClassNameGenerator(
    CompactInformationPanel.displayName || 'CompactInformationPanel',
  )
  return useMemo(
    () => ({
      wrapper: generate(),
    }),
    [generate],
  )
}
