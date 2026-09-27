'use client'

import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type FC,
  type Ref,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

import { useEnhancedEffect } from '../../../hooks/client/useEnhancedEffect'

type ParentContextValue = {
  seqs: number[]
}

const ParentContext = createContext<ParentContextValue>({
  seqs: [],
})

let portalSeq = 0

type PortalProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'data-portal-child-of' | 'data-portal-current-seq'
> & {
  as?: ElementType
  outerRef?: Ref<HTMLElement>
}

export const Portal: FC<PortalProps> = ({ as: Component = 'div', outerRef, children, ...rest }) => {
  const [currentSeq] = useState(() => ++portalSeq)
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
      <Component
        {...rest}
        ref={outerRef}
        data-portal-current-seq={currentSeq}
        data-portal-child-of={calculatedSeqs.portalChildOf}
      >
        {children}
      </Component>
    </ParentContext.Provider>,
    document.body,
  )
}
