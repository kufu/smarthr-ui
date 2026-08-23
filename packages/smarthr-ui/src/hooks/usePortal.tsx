import { type FC, type ReactNode, createContext, useContext, useMemo, useState } from 'react'
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

  const latest = useLatest({ currentSeq, portalRoot, calculatedSeqs })

  const functions = useMemo(() => {
    const PortalParentProvider: FC<{ children: ReactNode }> = ({ children }) => {
      const value: ParentContextValue = {
        seqs: latest.calculatedSeqs.parentSeqs,
      }

      return <ParentContext.Provider value={value}>{children}</ParentContext.Provider>
    }

    return {
      PortalParentProvider,
      isChildPortal: (element: HTMLElement | null) =>
        _isChildPortal(element, new RegExp(`(^|,)${latest.currentSeq}(,|$)`)),
      createPortal: (children: ReactNode) => {
        if (latest.portalRoot === null) {
          return null
        }

        return createPortal(children, latest.portalRoot)
      },
    }
  }, [latest])

  useEnhancedEffect(() => {
    // Next.jsのhydration error回避のため、マウント後にdivを作成してdocument.bodyに追加する
    const root = document.createElement('div')

    document.body.appendChild(root)
    setPortalRoot(root)

    return () => {
      root.remove()
    }
  }, [])

  useEnhancedEffect(() => {
    if (!portalRoot) return

    portalRoot.dataset.portalChildOf = calculatedSeqs.portalChildOf

    if (rootId) {
      portalRoot.setAttribute('id', rootId)
    }
  }, [calculatedSeqs.portalChildOf, portalRoot, rootId])

  return functions
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
