import { useMemo } from 'react'

import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'

import { Dialog } from '.'

export function useClassNames() {
  const generateForDialog = useClassNameGenerator(Dialog.displayName || 'Dialog')
  return useMemo(
    () => ({
      dialog: {
        titleArea: generateForDialog('titleArea'),
        title: generateForDialog('title'),
        subtitle: generateForDialog('subtitle'),
        body: generateForDialog('body'),
        description: generateForDialog('description'),
        actionArea: generateForDialog('actionArea'),
        buttonArea: generateForDialog('buttonArea'),
        closeButton: generateForDialog('closeButton'),
        actionButton: generateForDialog('actionButton'),
      },
    }),
    [generateForDialog],
  )
}
