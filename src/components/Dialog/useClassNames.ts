import { useMemo } from 'react'
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'
import { Dialog, ModelessDialog } from './'

export function useClassNames() {
  const generateForDialog = useClassNameGenerator(Dialog.displayName || 'Dialog')
  const generateForModeless = useClassNameGenerator(ModelessDialog.displayName || 'ModelessDialog')
  return useMemo(
    () => ({
      dialog: {
        wrapper: generateForDialog('wrapper'),
        dialog: generateForDialog(),
        background: generateForDialog('background'),
        title: generateForDialog('title'),
        body: generateForDialog('body'),
        description: generateForDialog('description'),
        actionArea: generateForDialog('actionArea'),
        buttonArea: generateForDialog('buttonArea'),
        closeButton: generateForDialog('closeButton'),
        actionButton: generateForDialog('actionButton'),
        alert: generateForDialog('alert'),
      },
      modelessDialog: {
        wrapper: generateForModeless(),
        header: generateForModeless('header'),
        closeButton: generateForModeless('closeButton'),
        content: generateForModeless('content'),
      },
    }),
    [generateForDialog, generateForModeless],
  )
}
