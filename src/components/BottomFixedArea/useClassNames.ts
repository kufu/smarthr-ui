import { useMemo } from 'react'

import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'

export function useClassNames() {
  const generate = useClassNameGenerator('BottomFixedArea')
  return useMemo(
    () => ({
      wrapper: generate(),
      description: generate('description'),
      buttonList: generate('buttonList'),
      primaryButton: generate('primaryButton'),
      secondaryButton: generate('secondaryButton'),
      tertiaryList: generate('tertiaryList'),
      tertiaryListItem: generate('tertiaryListItem'),
      tertiaryLink: generate('tertiaryLink'),
    }),
    [generate],
  )
}
