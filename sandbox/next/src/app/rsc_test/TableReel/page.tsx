import React from 'react'
import { TableReel } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function TableReelPage() {
  return (
    <>
      <RSCChecker actualComponent={TableReel} />
      <TableReel />
    </>
  )
}
