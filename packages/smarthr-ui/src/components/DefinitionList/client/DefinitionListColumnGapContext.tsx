'use client'

import { type FC, type PropsWithChildren, createContext } from 'react'

import { useTheme } from '../../../hooks/client/useTheme'

import type { PositiveGap } from '../../../types'

export const DefinitionListColumnGapContext = createContext<string | undefined>(undefined)

export const DefinitionListColumnGapProvider: FC<PropsWithChildren<{ gap: PositiveGap }>> = ({
  gap,
  children,
}) => {
  const theme = useTheme()
  const columnGap = typeof gap === 'number' ? theme.spacingByChar(gap) : theme.spacing[gap]

  return (
    <DefinitionListColumnGapContext.Provider value={columnGap}>
      {children}
    </DefinitionListColumnGapContext.Provider>
  )
}
