'use client'

import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type FC,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'

import { Portal } from './Portal'

type ParentContextValue = {
  seqs: number[]
}

const ParentContext = createContext<ParentContextValue>({
  seqs: [],
})

let portalSeq = 0

type NestablePortalProps = ComponentPropsWithoutRef<'div'> & {
  as?: ElementType
}

export const NestablePortal: FC<NestablePortalProps> = ({ children, ...rest }) => {
  const [currentSeq] = useState(() => ++portalSeq)
  const parent = useContext(ParentContext)

  const calculatedSeqs = useMemo(() => {
    const parentSeqs = parent.seqs.concat(currentSeq)

    return {
      parentSeqs,
      portalChildOf: parentSeqs.join(','),
    }
  }, [currentSeq, parent.seqs])

  return (
    <Portal
      {...rest}
      data-portal-current-seq={currentSeq}
      data-portal-child-of={calculatedSeqs.portalChildOf}
    >
      <ParentContext.Provider value={{ seqs: calculatedSeqs.parentSeqs }}>
        {children}
      </ParentContext.Provider>
    </Portal>
  )
}
