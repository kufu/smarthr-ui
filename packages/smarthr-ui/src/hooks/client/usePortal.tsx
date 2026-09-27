import {
  type FC,
  type PropsWithChildren,
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

export function usePortal({ rootId }: { rootId?: string } = {}) {
  const [currentSeq] = useState(() => ++portalSeq)

  const portalProps = useMemo(() => ({ currentSeq, rootId }), [currentSeq, rootId])

  const isChildPortal = useCallback(
    (element: HTMLElement | null) => _isChildPortal(element, new RegExp(`(^|,)${currentSeq}(,|$)`)),
    [currentSeq],
  )

  return { portalProps, isChildPortal }
}

type PortalProps = PropsWithChildren<{
  currentSeq: number
  rootId?: string
}>

export const Portal: FC<PortalProps> = ({ currentSeq, rootId, children }) => {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null)
  const parent = useContext(ParentContext)

  const calculatedSeqs = useMemo(() => {
    const parentSeqs = parent.seqs.concat(currentSeq)

    return {
      parentSeqs,
      portalChildOf: parentSeqs.join(','),
    }
  }, [currentSeq, parent.seqs])

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

  if (portalRoot === null) {
    return null
  }

  return createPortal(
    <ParentContext.Provider value={{ seqs: calculatedSeqs.parentSeqs }}>
      {children}
    </ParentContext.Provider>,
    portalRoot,
  )
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
