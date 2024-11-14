import React from 'react'
import { Pagination } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function PaginationPage() {
  return (
    <>
      <RSCChecker actualComponent={Pagination} />
      <Pagination total={0} current={0} onClick={() => {}} />
    </>
  )
}
