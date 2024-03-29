import { useCallback } from 'react'

const PREFIX = 'smarthr-ui'

export function useClassNameGenerator(componentName: string) {
  return useCallback(
    (partName?: string) => {
      if (!partName) {
        return `${PREFIX}-${componentName}`
      }
      return `${PREFIX}-${componentName}-${partName}`
    },
    [componentName],
  )
}
