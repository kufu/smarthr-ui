import React from 'react'
import { Table } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function TablePage() {
  return (
    <>
      <RSCChecker actualComponent={Table} />
      <Table />
    </>
  )
}
