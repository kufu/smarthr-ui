import { useMemo } from 'react'

import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'
import { BlankImage } from './BlankImage'

export function useClassNames() {
  const generateForBlankImage = useClassNameGenerator(BlankImage.displayName || 'BlankImage')
  return useMemo(
    () => ({
      blankImage: {
        wrapper: generateForBlankImage(),
      },
    }),
    [generateForBlankImage],
  )
}
