import { useMemo } from 'react'

import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'

import { Dialog, ModelessDialog } from '.'

export function useClassNames() {
  const generateForDialog = useClassNameGenerator(Dialog.displayName || 'Dialog')
  const generateForModeless = useClassNameGenerator(ModelessDialog.displayName || 'ModelessDialog')
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
      modelessDialog: {
        wrapper: generateForModeless(),
        box: generateForModeless('box'),
        header: generateForModeless('header'),
        handle: generateForModeless('handle'),
        closeButton: generateForModeless('closeButton'),
        content: generateForModeless('content'),
        footer: generateForModeless('footer'),
      },
    }),
    [generateForDialog, generateForModeless],
  )
}
