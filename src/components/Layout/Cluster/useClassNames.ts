import { useMemo } from 'react'

import { useClassNameGenerator } from '../../../hooks/useClassNameGenerator'
import { Cluster } from './Cluster'

export const useClassNames = () => {
  const generate = useClassNameGenerator(Cluster.displayName || 'Cluster')

  return useMemo(
    () => ({
      wrapper: generate('wrapper'),
      // Wrapper は意識しないはずなので Body に無印を与える
      body: generate(),
    }),
    [generate],
  )
}
