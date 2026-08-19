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
import { useLatest } from './useLatest'

type ParentContextValue = {
  seqs: number[]
}

const ParentContext = createContext<ParentContextValue>({
  seqs: [],
})

let portalSeq = 0

export function usePortal({ rootId }: { rootId?: string } = {}) {
  const [portalRoot, setPortalRoot] = useState<HTMLDivElement | null>(null)
  const [currentSeq] = useState(() => ++portalSeq)
  const parent = useContext(ParentContext)

  const calculatedSeqs = useMemo(() => {
    const parentSeqs = parent.seqs.concat(currentSeq)

    return {
      parentSeqs,
      portalChildOf: parentSeqs.join(','),
    }
  }, [currentSeq, parent.seqs])

  const latest = useLatest({ currentSeq })

  const functions = useMemo(
    () => ({
      isChildPortal: (element: HTMLElement | null) =>
        _isChildPortal(element, new RegExp(`(^|,)${latest.currentSeq}(,|$)`)),
    }),
    [latest],
  )

  const PortalParentProvider: FC<{ children: ReactNode }> = useCallback(
    ({ children }) => {
      const value: ParentContextValue = {
        seqs: calculatedSeqs.parentSeqs,
      }

      return <ParentContext.Provider value={value}>{children}</ParentContext.Provider>
    },
    [calculatedSeqs.parentSeqs],
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

  useEnhancedEffect(() => {
    // Next.jsのhydration error回避のため、初回レンダリング時にdivを作成する
    setPortalRoot((current) => {
      const root = current || document.createElement('div')

      if (rootId) {
        root.setAttribute('id', rootId)
      }

      return root
    })
  }, [rootId])

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

  return {
    portalRoot,
    isChildPortal: functions.isChildPortal,
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
