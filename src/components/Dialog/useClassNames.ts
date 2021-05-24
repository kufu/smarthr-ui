import { useMemo } from 'react'
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'
import { Dialog } from './Dialog'

export function useClassNames() {
  const generate = useClassNameGenerator(Dialog.displayName || 'Dialog')
  return useMemo(
    () => ({
      wrapper: generate('wrapper'),
      dialog: generate(),
      background: generate('background'),
      title: generate('title'),
      body: generate('body'),
      description: generate('description'),
      actionArea: generate('actionArea'),
      buttonArea: generate('buttonArea'),
      secondaryButton: generate('secondaryButton'),
      actionButton: generate('actionButton'),
      alert: generate('alert'),
    }),
    [generate],
  )
}
