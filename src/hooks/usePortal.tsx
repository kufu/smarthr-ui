import React, {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react'

interface PortalContextValue {
  currentSeq: number
  parentSeqs: number[]
}

const defaultContext: PortalContextValue = {
  currentSeq: 0,
  parentSeqs: [],
}

const PortalContext = createContext<PortalContextValue>(defaultContext)

export function usePortal() {
  const context = useContext(PortalContext)
  const { parentSeqs } = context
  const currentSeq = useMemo(() => ++context.currentSeq, [context])

  const portalRoot = useMemo(() => {
    const element = document.createElement('div')
    const seqs = parentSeqs.concat(currentSeq)
    element.dataset.portalChildOf = seqs.join(',')
    return element
  }, [parentSeqs, currentSeq])

  useEffect(() => {
    document.body.appendChild(portalRoot)
    return () => {
      document.body.removeChild(portalRoot)
    }
  }, [portalRoot])

  const isChildPortal = useCallback(
    (element: HTMLElement | null) => {
      return _isChildPortal(element, currentSeq)
    },
    [currentSeq],
  )

  const PortalParentProvider: FC<{ children: ReactNode }> = useCallback(
    ({ children }) => {
      const value: PortalContextValue = {
        ...context,
        parentSeqs: context.parentSeqs.concat(currentSeq),
      }
      return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
    },
    [context, currentSeq],
  )

  return {
    portalRoot,
    isChildPortal,
    PortalParentProvider,
  }
}

function _isChildPortal(element: HTMLElement | null, parentPortalSeq: number): boolean {
  if (!element) return false
  const childOf = element.dataset.portalChildOf || ''
  const includesSeq = childOf.split(',').includes(String(parentPortalSeq))
  return includesSeq || _isChildPortal(element.parentElement, parentPortalSeq)
}
