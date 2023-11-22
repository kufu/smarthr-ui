import { useMemo } from 'react'

import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'

import { DialogBase } from './DialogBase'

export const useClassNames = () => {
  const generateDialogBase = useClassNameGenerator(DialogBase.displayName || 'DialogBase')

  return useMemo(
    () => ({
      dialogBase: {
        wrapper: generateDialogBase(),
      },
    }),
    [generateDialogBase],
  )
}
