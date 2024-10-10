import React from 'react'
import { SpreadsheetTable } from 'smarthr-ui'
export default function SpreadsheetTablePage() {
  return (
    <>
      <div>Success: SpreadsheetTable</div>
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
