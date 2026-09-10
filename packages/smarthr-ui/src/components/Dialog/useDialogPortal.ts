import {
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

const resolveParent = (parent?: HTMLElement | RefObject<HTMLElement>) =>
  parent && 'current' in parent ? parent.current : parent

export function useDialogPortal(parent?: HTMLElement | RefObject<HTMLElement>, id?: string) {
  const [portalContainer] = useState<HTMLDivElement | null>(() =>
    typeof document === 'undefined' ? null : document.createElement('div'),
  )
  const [retryCount, setRetryCount] = useState(0)

  useLayoutEffect(() => {
    if (!portalContainer) {
      return
    }

    if (id) {
      portalContainer.id = id
    }

    const actualParent = resolveParent(parent) || document.body

    actualParent.appendChild(portalContainer)

    return () => {
      actualParent.removeChild(portalContainer)
    }
  }, [id, parent, portalContainer, retryCount])

  // parent の ref が自分の祖先を指す場合、React は子から先にコミットするため
  // useLayoutEffect の時点ではまだ ref が付いていない。
  useEffect(() => {
    const resolved = resolveParent(parent)

    if (portalContainer && resolved && portalContainer.parentElement !== resolved) {
      setRetryCount((current) => current + 1)
    }
  }, [parent, portalContainer])

  return {
    createPortal: useCallback(
      (children: ReactNode) => (portalContainer ? createPortal(children, portalContainer) : null),
      [portalContainer],
    ),
  }
}
