'use client'

import { type ReactNode, useCallback, useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export function useDialogPortal(parent?: HTMLElement, id?: string) {
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

    // parent が存在しない場合は document.body をデフォルトの配置先にする
    const actualParent = parent || document.body

    actualParent.appendChild(portalContainer)

    return () => {
      actualParent.removeChild(portalContainer)
    }
  }, [id, parent, portalContainer])

  const wrappedCreatePortal = useCallback(
    (children: ReactNode) =>
      portalContainer === null ? null : createPortal(children, portalContainer),
    [portalContainer],
  )

  return {
    createPortal: wrappedCreatePortal,
  }
}
