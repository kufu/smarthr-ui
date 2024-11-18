import React from 'react'
import { EmptyTableBody } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function EmptyTableBodyPage() {
  return (
    <>
      <RSCChecker actualComponent={EmptyTableBody} />
      <EmptyTableBody />
    </>
  )
}
