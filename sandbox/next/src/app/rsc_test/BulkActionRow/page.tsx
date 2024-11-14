import React from 'react'
import { BulkActionRow } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function BulkActionRowPage() {
  return (
    <>
      <RSCChecker actualComponent={BulkActionRow} />
      <BulkActionRow />
    </>
  )
}
