import { useMemo } from 'react'

import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'

import { Body, Cell, Head, Row, Td, Th } from '.'

export function useClassNames() {
  const generateForBody = useClassNameGenerator(Body.displayName || 'Body')
  const generateForHead = useClassNameGenerator(Head.displayName || 'Head')
  const generateForRow = useClassNameGenerator(Row.displayName || 'Row')
  const generateForCell = useClassNameGenerator(Cell.displayName || 'Cell')
  return useMemo(
    () => ({
      head: {
        wrapper: generateForHead(),
        bulkActionArea: generateForHead('bulkActionArea'),
      },
      body: {
        wrapper: generateForBody(),
      },
      row: {
        wrapper: generateForRow(),
      },
      cell: {
        wrapper: generateForCell(),
      },
    }),
    [generateForBody, generateForCell, generateForHead, generateForRow],
  )
}

export function useThClassNames() {
  const generate = useClassNameGenerator(Th.displayName || 'Th')
  return useMemo(
    () => ({
      wrapper: generate(),
    }),
    [generate],
  )
}

export function useTdClassNames() {
  const generate = useClassNameGenerator(Td.displayName || 'Td')
  return useMemo(
    () => ({
      wrapper: generate(),
    }),
    [generate],
  )
}
