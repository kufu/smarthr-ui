import React from 'react'
import { SpreadsheetTableCorner } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function SpreadsheetTableCornerPage() {
  return (
    <>
      <RSCChecker actualComponent={SpreadsheetTableCorner} />
      <SpreadsheetTableCorner />
    </>
  )
}
