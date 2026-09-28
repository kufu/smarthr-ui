'use client'

import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type FC,
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

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
}

export const Portal: FC<PortalProps> = ({ as: Component = 'div', children, ...rest }) => {
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

  if (!mounted) {
    return <MountChecker setMounted={setMounted} />
  }

  return createPortal(
    <ParentContext.Provider value={{ seqs: calculatedSeqs.parentSeqs }}>
      <Component
        {...rest}
        data-portal-current-seq={currentSeq}
        data-portal-child-of={calculatedSeqs.portalChildOf}
      >
        {children}
      </Component>
    </ParentContext.Provider>,
    document.body,
  )
}

const MountChecker: FC<{ setMounted: (mounted: boolean) => void }> = ({ setMounted }) => {
  useLayoutEffect(() => {
    // Next.jsのhydration error回避のため、マウント後にのみportalを描画する
    setMounted(true)
  }, [setMounted])

  return null
}
