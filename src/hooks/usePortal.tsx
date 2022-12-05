import React, {
  ReactNode,
  VFC,
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react'
import { createPortal } from 'react-dom'

interface ParentContextValue {
  seqs: number[]
}

const ParentContext = createContext<ParentContextValue>({
  seqs: [],
})

let portalSeq = 0

export function usePortal() {
  const portalRoot = useRef<HTMLDivElement | null>(
    typeof document === 'undefined' ? null : (document.createElement('div') as HTMLDivElement),
  ).current
  const currentSeq = useMemo(() => ++portalSeq, [])
  const parent = useContext(ParentContext)
  const parentSeqs = parent.seqs.concat(currentSeq)

  useLayoutEffect(() => {
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
  }, [...parentSeqs])

  const isChildPortal = useCallback(
    (element: HTMLElement | null) => {
      return _isChildPortal(element, currentSeq)
    },
    [currentSeq],
  )

  const PortalParentProvider: VFC<{ children: ReactNode }> = useCallback(
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
