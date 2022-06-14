import { ReactNode, RefObject, useCallback, useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export function useDialogPortal(parent?: HTMLElement | RefObject<HTMLElement>) {
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    const createdPortalContainer = document.createElement('div')
    setPortalContainer(createdPortalContainer)
    const parentElement = parent != null && 'current' in parent ? parent.current : parent
    // SSR を考慮し、useEffect 内で初期値 document.body を指定
    const actualParent = parentElement || document.body
    actualParent.appendChild(createdPortalContainer)
    return () => {
      actualParent.removeChild(createdPortalContainer)
    }
  }, [parent])

  const wrappedCreatePortal = useCallback(
    (children: ReactNode) => {
      if (portalContainer === null) {
        return null
      }
      return createPortal(children, portalContainer)
    },
    [portalContainer],
  )

  return {
    createPortal: wrappedCreatePortal,
    isReady: portalContainer !== null,
  }
}
