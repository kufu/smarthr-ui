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
  // parent が未解決だったときに再試行するためのカウンタ。詳細は下の useEffect を参照。
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

  // Why not 上の useLayoutEffect だけで済ませないか:
  // React は子から順にコミットするため、parent に渡された ref が自分の祖先要素を指す場合、
  // useLayoutEffect の時点ではまだ ref が付いておらず body へフォールバックしてしまう。
  // ref オブジェクトの参照は変わらないので、それだけでは二度と再解決されない。
  // ref が付いたあとに走るこの useEffect で取りこぼしを検出し、一度だけ付け替える。
  // 兄弟要素の ref や HTMLElement を直接渡した場合は上で解決済みなので、ここは何もしない。
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
