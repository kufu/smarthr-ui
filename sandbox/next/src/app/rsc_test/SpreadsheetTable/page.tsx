import React from 'react'
import { SpreadsheetTable } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function SpreadsheetTablePage() {
  return (
    <>
      <RSCChecker actualComponent={SpreadsheetTable} />
      <SpreadsheetTable
        data={[
          ['A', 'B', 'C'],
          [1, 2, 3],
          [4, 5, 6],
        ]}
      />
    </>
  )
}
