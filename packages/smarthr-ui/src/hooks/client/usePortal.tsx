import {
  type ComponentPropsWithoutRef,
  type FC,
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
  const [currentSeq] = useState(() => ++portalSeq)

  const portalProps = useMemo(() => ({ currentSeq }), [currentSeq])

  const isChildPortal = useCallback(
    (element: HTMLElement | null) => _isChildPortal(element, new RegExp(`(^|,)${currentSeq}(,|$)`)),
    [currentSeq],
  )

  return { portalProps, isChildPortal }
}

type PortalProps = Omit<ComponentPropsWithoutRef<'div'>, 'data-portal-child-of'> & {
  currentSeq: number
}

export const Portal: FC<PortalProps> = ({ currentSeq, children, ...rest }) => {
  const [mounted, setMounted] = useState(false)
  const parent = useContext(ParentContext)

  const calculatedSeqs = useMemo(() => {
    const parentSeqs = parent.seqs.concat(currentSeq)

    return {
      parentSeqs,
      portalChildOf: parentSeqs.join(','),
    }
  }, [currentSeq, parent.seqs])

  useEnhancedEffect(() => {
    // Next.jsのhydration error回避のため、マウント後にのみportalを描画する
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return createPortal(
    <ParentContext.Provider value={{ seqs: calculatedSeqs.parentSeqs }}>
      <div {...rest} data-portal-child-of={calculatedSeqs.portalChildOf}>
        {children}
      </div>
    </ParentContext.Provider>,
    document.body,
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
