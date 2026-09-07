import { type ReactNode, type RefObject, useCallback, useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export function useDialogPortal(parent?: HTMLElement | RefObject<HTMLElement>, id?: string) {
  const [portalContainer] = useState<HTMLDivElement | null>(() =>
    typeof document === 'undefined' ? null : document.createElement('div'),
  )

  useLayoutEffect(() => {
    if (!portalContainer) {
      return
    }

    if (id) {
      portalContainer.id = id
    }

    const parentElement = parent && 'current' in parent ? parent.current : parent
    const actualParent = parentElement || document.body

    actualParent.appendChild(portalContainer)

    return () => {
      actualParent.removeChild(portalContainer)
    }
  }, [id, parent, portalContainer])

  return {
    createPortal: useCallback(
      (children: ReactNode) => (portalContainer ? createPortal(children, portalContainer) : null),
      [portalContainer],
    ),
  }
}
