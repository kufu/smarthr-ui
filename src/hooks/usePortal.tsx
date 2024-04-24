import React, {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
  const [isMounted, setMounted] = useState(false)
  const portalRoot = useRef<HTMLDivElement | null>(null)
  const currentSeq = useMemo(() => ++portalSeq, [])
  const parent = useContext(ParentContext)
  const parentSeqs = parent.seqs.concat(currentSeq)

  useEffect(() => {
    portalRoot.current = document.createElement('div')
    setMounted(true)
  }, [])

  useEnhancedEffect(() => {
    const currentPortalRoot = portalRoot.current
    if (!currentPortalRoot) {
      return
    }
    currentPortalRoot.dataset.portalChildOf = parentSeqs.join(',')
    document.body.appendChild(currentPortalRoot)
    return () => {
      document.body.removeChild(currentPortalRoot)
    }
    // spread parentSeqs array for deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, ...parentSeqs])

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
      if (portalRoot.current === null) {
        return null
      }
      return createPortal(children, portalRoot.current)
    },
    [portalRoot],
  )

  return {
    portalRoot,
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
