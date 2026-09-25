import { type ReactNode, type RefObject, useCallback, useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export function useDialogPortal(parent?: HTMLElement | RefObject<HTMLElement>, id?: string) {
  const [portalContainer] = useState<HTMLDivElement | null>(() =>
    typeof document === 'undefined' ? null : document.createElement('div'),
  )
  // HINT: containerがDOMに接続される前に子を描画すると、子孫のref attach時点で
  // getBoundingClientRectやfocusが効かない(ModelessDialogの中央寄せずれの原因)。
  // 接続後にのみ描画するためのフラグ
  const [isAttached, setIsAttached] = useState(false)

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
    setIsAttached(true)

    return () => {
      actualParent.removeChild(portalContainer)
    }
  }, [id, parent, portalContainer])

  return {
    createPortal: useCallback(
      (children: ReactNode) =>
        portalContainer && isAttached ? createPortal(children, portalContainer) : null,
      [portalContainer, isAttached],
    ),
  }
}
