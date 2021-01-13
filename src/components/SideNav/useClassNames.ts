import { useMemo } from 'react'

import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'

export function useClassNames() {
  const generate = useClassNameGenerator('SideNav')
  return useMemo(
    () => ({
      wrapper: generate(),
      item: generate('item'),
      itemTitle: generate('itemTitle'),
    }),
    [generate],
  )
}
