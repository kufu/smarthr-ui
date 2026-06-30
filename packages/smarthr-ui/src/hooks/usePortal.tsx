import {
  type FC,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

import { useEnhancedEffect } from './useEnhancedEffect'

type ParentContextValue = {
  seqs: number[]
}

const ParentContext = createContext<ParentContextValue>({
  seqs: [],
})

let portalSeq = 0

export function usePortal() {
  const [portalRoot, setPortalRoot] = useState<HTMLDivElement | null>(null)
  const currentSeq = useMemo(() => ++portalSeq, [])
  const parent = useContext(ParentContext)

  const calculatedSeqs = useMemo(() => {
    const parentSeqs = parent.seqs.concat(currentSeq)

    return {
      parentSeqs,
      portalChildOf: parentSeqs.join(','),
    }
  }, [currentSeq, parent.seqs])

  const propsRef = useRef({ calculatedSeqs, portalRoot })
  propsRef.current = { calculatedSeqs, portalRoot }

  useEnhancedEffect(() => {
    // Next.jsのhydration error回避のため、初回レンダリング時にdivを作成する
    setPortalRoot(document.createElement('div'))
  }, [])

  useEnhancedEffect(() => {
    if (!portalRoot) {
      return
    }

    portalRoot.dataset.portalChildOf = calculatedSeqs.portalChildOf
    document.body.appendChild(portalRoot)

    return () => {
      portalRoot.remove()
    }
  }, [portalRoot, calculatedSeqs.portalChildOf])

  const isChildPortal = useCallback(
    (element: HTMLElement | null) => _isChildPortal(element, new RegExp(`(^|,)${currentSeq}(,|$)`)),
    [currentSeq],
  )

  const PortalParentProvider: FC<{ children: ReactNode }> = useCallback(({ children }) => {
    const value: ParentContextValue = {
      seqs: propsRef.current.calculatedSeqs.parentSeqs,
    }

    return <ParentContext.Provider value={value}>{children}</ParentContext.Provider>
  }, [])

  const wrappedCreatePortal = useCallback((children: ReactNode) => {
    if (propsRef.current.portalRoot === null) {
      return null
    }

    return createPortal(children, propsRef.current.portalRoot)
  }, [])

  const isPortalRootMounted = useCallback(() => propsRef.current.portalRoot !== null, [])

  return {
    portalRoot,
    isPortalRootMounted,
    isChildPortal,
    PortalParentProvider,
    createPortal: wrappedCreatePortal,
  }
}

function _isChildPortal(element: HTMLElement | SVGElement | null, seqRegex: RegExp): boolean {
  if (!element) return false

  let includesSeq = false
  const childOf = element.dataset?.portalChildOf

  if (childOf) {
    includesSeq = seqRegex.test(childOf)
  }

  return includesSeq || _isChildPortal(element.parentElement, seqRegex)
}
