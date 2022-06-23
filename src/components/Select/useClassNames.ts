import { ComponentProps, VFC, useMemo } from 'react'

import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'
import { Select } from './Select'

export const useClassNames = (size?: ComponentProps<typeof Select>['size']) => {
  const generate = useClassNameGenerator((Select as VFC).displayName || 'Select')
  return useMemo(
    () => ({
      wrapper: generate(),
      size: size === 's' ? '--small' : '',
    }),
    [generate, size],
  )
}
