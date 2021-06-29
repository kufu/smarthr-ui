import { useMemo } from 'react'

import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'
import { Body, Cell, Head, Row, Table } from './'

export function useClassNames() {
  const generateForTable = useClassNameGenerator(Table.displayName || 'Table')
  const generateForBody = useClassNameGenerator(Body.displayName || 'Body')
  const generateForHead = useClassNameGenerator(Head.displayName || 'Head')
  const generateForRow = useClassNameGenerator(Row.displayName || 'Row')
  const generateForCell = useClassNameGenerator(Cell.displayName || 'Cell')
  return useMemo(
    () => ({
      table: {
        wrapper: generateForTable(),
      },
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
    [generateForBody, generateForCell, generateForHead, generateForRow, generateForTable],
  )
}
