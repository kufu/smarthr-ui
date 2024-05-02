import React, {
  FC,
  ReactNode,
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
  const parentSeqs = parent.seqs.concat(currentSeq)

  useEnhancedEffect(() => {
    // Next.jsのhydration error回避のため、初回レンダリング時にdivを作成する
    setPortalRoot(document.createElement('div'))
  }, [])

  useEnhancedEffect(() => {
    if (!portalRoot) {
      return
    }
    portalRoot.dataset.portalChildOf = parentSeqs.join(',')
    document.body.appendChild(portalRoot)
    return () => {
      document.body.removeChild(portalRoot)
    }
    // spread parentSeqs array for deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portalRoot, ...parentSeqs])

  const isChildPortal = useCallback(
    (element: HTMLElement | null) => _isChildPortal(element, currentSeq),
    [currentSeq],
  )

  const PortalParentProvider: FC<{ children: ReactNode }> = useCallback(
    ({ children }) => {
      const value: ParentContextValue = {
        seqs: parentSeqs,
      }
      return <ParentContext.Provider value={value}>{children}</ParentContext.Provider>
    },
    // spread parentSeqs array for deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...parentSeqs],
  )

  const wrappedCreatePortal = useCallback(
    (children: ReactNode) => {
      if (portalRoot === null) {
        return null
      }
      return createPortal(children, portalRoot)
    },
    [portalRoot],
  )

  const isPortalRootMounted = useCallback(() => portalRoot !== null, [portalRoot])

  return {
    portalRoot,
    isPortalRootMounted,
    isChildPortal,
    PortalParentProvider,
    createPortal: wrappedCreatePortal,
  }
}

function _isChildPortal(
  element: HTMLElement | SVGElement | null,
  parentPortalSeq: number,
): boolean {
  if (!element) return false
  const childOf = element.dataset?.portalChildOf || ''
  const includesSeq = childOf.split(',').includes(String(parentPortalSeq))
  return includesSeq || _isChildPortal(element.parentElement, parentPortalSeq)
}
